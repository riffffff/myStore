<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Product;
use App\Models\Review;
use App\Models\ShopSetting;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    // ── Dashboard ────────────────────────────────────────────
    public function dashboard(Request $request): Response
    {
        // ── 1. Stock Pie Chart ───────────────────────────────
        $stockChart = Product::selectRaw('stock_status, COUNT(*) as total')
            ->groupBy('stock_status')
            ->pluck('total', 'stock_status')
            ->toArray();

        $soldTotal = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', '!=', 'cancelled')
            ->sum('order_items.quantity');
        $stockChart['sold'] = (int) $soldTotal;

        // ── 2. Sales Line Chart ──────────────────────────────
        $period    = $request->query('period', '7');
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        $driver   = DB::connection()->getDriverName();
        $dateExpr = $driver === 'sqlite' ? "strftime('%Y-%m-%d', created_at)" : "DATE(created_at)";
        $hourExpr = $driver === 'sqlite' ? "strftime('%H:00', created_at)" : "DATE_FORMAT(created_at, '%H:00')";

        $salesQuery = DB::table('orders')->where('status', '!=', 'cancelled');

        if ($period === 'today' || $period === 'day') {
            $salesQuery->whereDate('created_at', today());
            $timeExpr = $hourExpr;
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $salesQuery->whereBetween('created_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(),
                \Carbon\Carbon::parse($endDate)->endOfDay(),
            ]);
            $timeExpr = $dateExpr;
        } else {
            $days = match ($period) {
                'today', 'day' => 1,
                'week', '7'    => 7,
                'month', '30'  => 30,
                '90'           => 90,
                default        => 7,
            };
            $salesQuery->where('created_at', '>=', now()->subDays($days));
            $timeExpr = $dateExpr;
        }

        $salesChart = $salesQuery
            ->selectRaw("{$timeExpr} as date, COUNT(*) as orders, COALESCE(SUM(total_price), 0) as revenue")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($r) => [
                'date'    => (string) $r->date,
                'orders'  => (int) $r->orders,
                'revenue' => (int) $r->revenue,
            ])
            ->values();

        // ── 3. Top Articles by views ─────────────────────────
        $topArticles = Article::where('is_published', true)
            ->orderByDesc('views_count')
            ->take(5)
            ->get(['id', 'title', 'views_count', 'published_at'])
            ->map(fn ($a) => [
                'id'          => $a->id,
                'title'       => $a->title,
                'views_count' => (int) $a->views_count,
            ]);

        // ── 4. Summary Stats ─────────────────────────────────
        $stats = [
            'products'           => Product::count(),
            'published'          => Product::where('is_published', true)->count(),
            'out_of_stock'       => Product::where('stock_status', 'out_of_stock')->count(),
            'articles'           => Article::count(),
            'published_articles' => Article::where('is_published', true)->count(),
            'reviews'            => Review::count(),
            'pending_reviews'    => Review::where('is_approved', false)->count(),
            'orders_total'       => DB::table('orders')->count(),
            'orders_pending'     => DB::table('orders')->where('status', 'pending')->count(),
            'revenue_total'      => (int) DB::table('orders')->where('status', '!=', 'cancelled')->sum('total_price'),
        ];

        // ── 5. Recent Orders ─────────────────────────────────
        $recentOrders = DB::table('orders')
            ->latest()
            ->take(5)
            ->get(['id', 'order_number', 'customer_name', 'total_price', 'status', 'created_at'])
            ->map(fn ($o) => [
                'id'            => $o->id,
                'order_number'  => $o->order_number,
                'customer_name' => $o->customer_name,
                'total_price'   => (int) $o->total_price,
                'status'        => $o->status,
                'created_at'    => \Carbon\Carbon::parse($o->created_at)->diffForHumans(),
            ]);

        // ── 6. Pending Reviews ───────────────────────────────
        $pendingReviews = Review::where('is_approved', false)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'author_name' => $r->author_name ?? 'Anonim',
                'rating'      => $r->rating,
                'body'        => $r->body ?? '',
                'created_at'  => $r->created_at->diffForHumans(),
            ]);

        return Inertia::render('MobileAdmin/Dashboard', compact(
            'stats', 'stockChart', 'salesChart', 'topArticles',
            'recentOrders', 'pendingReviews', 'period',
            'startDate', 'endDate',
        ));
    }

    // ── Products List ────────────────────────────────────────
    public function products(Request $request): Response
    {
        $search = $request->input('search', '');

        $products = Product::with('images')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->through(fn ($p) => [
                'id'           => $p->id,
                'name'         => $p->name,
                'price'        => $p->price,
                'stock_status' => $p->stock_status,
                'is_published' => $p->is_published,
                'category'     => $p->category,
                'cover'        => $p->images->where('is_primary', true)->first()?->url
                                ?? $p->images->first()?->url,
            ]);

        return Inertia::render('MobileAdmin/Products/Index', [
            'products' => $products,
            'search'   => $search,
        ]);
    }

    // ── Create Product Form ──────────────────────────────────
    public function productCreate(): Response
    {
        return Inertia::render('MobileAdmin/Products/Form', [
            'product'    => null,
            'categories' => $this->getProductCategories(),
        ]);
    }

    // ── Store New Product ────────────────────────────────────
    public function productStore(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255|min:3',
            'price'        => 'required|numeric|min:0',
            'stock_status' => 'required|in:available,preorder,out_of_stock',
            'category'     => 'nullable|string',
            'description'  => 'nullable|string',
            'is_published' => 'boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $product = Product::create([
            'name'         => $data['name'],
            'price'        => $data['price'],
            'stock_status' => $data['stock_status'],
            'category'     => $data['category'] ?? 'lainnya',
            'description'  => $data['description'] ?? null,
            'is_published' => $request->boolean('is_published', true),
        ]);

        if ($request->hasFile('image')) {
            $imageService = app(ImageService::class);
            $paths = $imageService->handleUpload($request->file('image'), 'products');
            if (!empty($paths['url'])) {
                $product->images()->create([
                    'url'        => $paths['url'],
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }
        }

        return redirect()->route('admin.products')->with('success', 'Produk berhasil ditambahkan.');
    }

    // ── Edit Product Form ────────────────────────────────────
    public function productEdit(Product $product): Response
    {
        $product->load('images');
        return Inertia::render('MobileAdmin/Products/Form', [
            'product' => [
                'id'           => $product->id,
                'name'         => $product->name,
                'price'        => (int) $product->price,
                'stock_status' => $product->stock_status,
                'category'     => $product->category,
                'description'  => $product->description,
                'is_published' => (bool) $product->is_published,
                'cover'        => $product->images->where('is_primary', true)->first()?->url
                                  ?? $product->images->first()?->url,
            ],
            'categories' => $this->getProductCategories(),
        ]);
    }

    // ── Update Product ───────────────────────────────────────
    public function productUpdate(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255|min:3',
            'price'        => 'required|numeric|min:0',
            'stock_status' => 'required|in:available,preorder,out_of_stock',
            'category'     => 'nullable|string',
            'description'  => 'nullable|string',
            'is_published' => 'boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $product->update([
            'name'         => $data['name'],
            'price'        => $data['price'],
            'stock_status' => $data['stock_status'],
            'category'     => $data['category'] ?? 'lainnya',
            'description'  => $data['description'] ?? null,
            'is_published' => $request->boolean('is_published', true),
        ]);

        if ($request->hasFile('image')) {
            $imageService = app(ImageService::class);
            $paths = $imageService->handleUpload($request->file('image'), 'products');
            if (!empty($paths['url'])) {
                $primary = $product->images()->where('is_primary', true)->first();
                if ($primary) {
                    $imageService->deleteIfExists($primary->url);
                    $primary->update(['url' => $paths['url']]);
                } else {
                    $product->images()->create([
                        'url'        => $paths['url'],
                        'is_primary' => true,
                        'sort_order' => 0,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products')->with('success', 'Produk berhasil diperbarui.');
    }

    // ── Destroy Product ──────────────────────────────────────
    public function productDestroy(Product $product): RedirectResponse
    {
        $imageService = app(ImageService::class);
        foreach ($product->images as $img) {
            $imageService->deleteIfExists($img->url);
            $img->delete();
        }
        $product->delete();
        return redirect()->route('admin.products')->with('success', 'Produk berhasil dihapus.');
    }

    // ── Toggle Product Publish Status ────────────────────────
    public function productTogglePublish(Product $product): RedirectResponse
    {
        $product->update(['is_published' => ! $product->is_published]);
        return back()->with('success', $product->is_published ? 'Produk dipublikasikan.' : 'Produk disembunyikan.');
    }

    // ── Toggle Product Stock Status ──────────────────────────
    public function productUpdateStock(Request $request, Product $product): RedirectResponse
    {
        $request->validate(['stock_status' => 'required|in:available,preorder,out_of_stock']);
        $product->update(['stock_status' => $request->stock_status]);
        return back()->with('success', 'Status stok diperbarui.');
    }

    // ── Articles List ────────────────────────────────────────
    public function articles(Request $request): Response
    {
        $search = $request->input('search', '');

        $articles = Article::when($search, fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->through(fn ($a) => [
                'id'           => $a->id,
                'title'        => $a->title,
                'slug'         => $a->slug,
                'is_published' => $a->is_published,
                'created_at'   => $a->created_at->format('d M Y'),
                'cover'        => $a->image,
            ]);

        return Inertia::render('MobileAdmin/Articles/Index', [
            'articles' => $articles,
            'search'   => $search,
        ]);
    }

    // ── Create Article Form ──────────────────────────────────
    public function articleCreate(): Response
    {
        return Inertia::render('MobileAdmin/Articles/Form', [
            'article' => null,
        ]);
    }

    // ── Store New Article ────────────────────────────────────
    public function articleStore(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string|max:500',
            'content'      => 'required|string',
            'is_published' => 'boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $paths = app(ImageService::class)->handleUpload($request->file('image'), 'articles');
            $imagePath = $paths['url'] ?? null;
        }

        Article::create([
            'title'        => $data['title'],
            'excerpt'      => $data['excerpt'] ?? null,
            'content'      => $data['content'],
            'image'        => $imagePath,
            'is_published' => $request->boolean('is_published', true),
            'published_at' => $request->boolean('is_published', true) ? now() : null,
        ]);

        return redirect()->route('admin.articles')->with('success', 'Artikel berhasil dibuat.');
    }

    // ── Edit Article Form ────────────────────────────────────
    public function articleEdit(Article $article): Response
    {
        return Inertia::render('MobileAdmin/Articles/Form', [
            'article' => [
                'id'           => $article->id,
                'title'        => $article->title,
                'excerpt'      => $article->excerpt,
                'content'      => $article->content,
                'is_published' => (bool) $article->is_published,
                'image'        => $article->image,
            ],
        ]);
    }

    // ── Update Article ───────────────────────────────────────
    public function articleUpdate(Request $request, Article $article): RedirectResponse
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string|max:500',
            'content'      => 'required|string',
            'is_published' => 'boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $updateData = [
            'title'        => $data['title'],
            'excerpt'      => $data['excerpt'] ?? null,
            'content'      => $data['content'],
            'is_published' => $request->boolean('is_published', true),
        ];

        if ($request->boolean('is_published') && ! $article->published_at) {
            $updateData['published_at'] = now();
        }

        if ($request->hasFile('image')) {
            if ($article->image) {
                app(ImageService::class)->deleteIfExists($article->image);
            }
            $paths = app(ImageService::class)->handleUpload($request->file('image'), 'articles');
            if (!empty($paths['url'])) {
                $updateData['image'] = $paths['url'];
            }
        }

        $article->update($updateData);

        return redirect()->route('admin.articles')->with('success', 'Artikel berhasil diperbarui.');
    }

    // ── Destroy Article ──────────────────────────────────────
    public function articleDestroy(Article $article): RedirectResponse
    {
        if ($article->image) {
            app(ImageService::class)->deleteIfExists($article->image);
        }
        $article->delete();
        return redirect()->route('admin.articles')->with('success', 'Artikel berhasil dihapus.');
    }

    // ── Toggle Article Publish ───────────────────────────────
    public function articleTogglePublish(Article $article): RedirectResponse
    {
        $article->update(['is_published' => ! $article->is_published]);
        return back()->with('success', $article->is_published ? 'Artikel dipublikasikan.' : 'Artikel disembunyikan.');
    }

    // ── Reviews List ─────────────────────────────────────────
    public function reviews(Request $request): Response
    {
        $filter = $request->input('filter', 'all');

        $reviews = Review::when($filter === 'pending', fn ($q) => $q->where('is_approved', false))
            ->when($filter === 'approved', fn ($q) => $q->where('is_approved', true))
            ->latest()
            ->paginate(20)
            ->through(fn ($r) => [
                'id'          => $r->id,
                'author_name' => $r->author_name,
                'rating'      => $r->rating,
                'body'        => $r->body,
                'is_approved' => $r->is_approved,
                'created_at'  => $r->created_at->format('d M Y'),
            ]);

        $pendingCount = Review::where('is_approved', false)->count();

        return Inertia::render('MobileAdmin/Reviews/Index', [
            'reviews'      => $reviews,
            'filter'       => $filter,
            'pendingCount' => $pendingCount,
        ]);
    }

    // ── Approve / Reject Review ──────────────────────────────
    public function reviewApprove(Review $review): RedirectResponse
    {
        $review->update(['is_approved' => true]);
        return back()->with('success', 'Review disetujui.');
    }

    public function reviewReject(Review $review): RedirectResponse
    {
        $review->delete();
        return back()->with('success', 'Review dihapus.');
    }

    // ── Shop Settings ────────────────────────────────────────
    public function settings(): Response
    {
        $settings = ShopSetting::getSettings();

        return Inertia::render('MobileAdmin/Settings', [
            'settings' => [
                'shop_name'    => $settings->shop_name,
                'shop_tagline' => $settings->hero_banner_text_1 ?? $settings->description,
                'shop_phone'   => $settings->whatsapp_number,
                'shop_email'   => '',
                'shop_address' => $settings->address,
                'logo_url'     => $settings->getLogoUrl('light'),
                'qris_url'     => $settings->getQrisImageUrl(),
            ],
        ]);
    }

    // ── Update Shop Settings ─────────────────────────────────
    public function settingsUpdate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'shop_name'    => 'required|string|max:255',
            'shop_tagline' => 'nullable|string|max:500',
            'shop_phone'   => 'nullable|string|max:20',
            'shop_email'   => 'nullable|email|max:255',
            'shop_address' => 'nullable|string|max:1000',
        ]);

        $settings = ShopSetting::getSettings();
        $settings->shop_name = $data['shop_name'];
        if (! empty($data['shop_tagline'])) {
            $settings->hero_banner_text_1 = $data['shop_tagline'];
            $settings->description = $data['shop_tagline'];
        }
        if (! empty($data['shop_phone'])) {
            $settings->whatsapp_number = $data['shop_phone'];
        }
        if (isset($data['shop_address'])) {
            $settings->address = $data['shop_address'];
        }
        $settings->save();

        return back()->with('success', 'Pengaturan toko disimpan.');
    }

    // ── Categories List ─────────────────────────────────────
    private function getProductCategories(): array
    {
        return [
            ['id' => 'kursi_tamu',   'name' => 'Kursi Tamu / Sofa'],
            ['id' => 'meja_makan',   'name' => 'Set Meja Makan'],
            ['id' => 'tempat_tidur', 'name' => 'Tempat Tidur / Dipan'],
            ['id' => 'lemari',       'name' => 'Lemari Pakaian'],
            ['id' => 'meja_kerja',   'name' => 'Meja Kerja / Belajar'],
            ['id' => 'bufet',        'name' => 'Bufet / Hiasan Dinding'],
            ['id' => 'rak',          'name' => 'Rak Buku / Display'],
            ['id' => 'aksesoris',    'name' => 'Aksesoris & Pajangan'],
            ['id' => 'lainnya',      'name' => 'Lainnya'],
        ];
    }
}
