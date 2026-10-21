<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
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
                'author_name' => $r->name ?: 'Pelanggan',
                'rating'      => $r->rating,
                'body'        => $r->review ?: '',
                'created_at'  => $r->created_at->diffForHumans(),
            ]);

        return Inertia::render('MobileAdmin/Dashboard', compact(
            'stats', 'stockChart', 'salesChart', 'topArticles',
            'recentOrders', 'pendingReviews', 'period',
            'startDate', 'endDate',
        ));
    }

    // ── Orders List ──────────────────────────────────────────
    public function orders(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = $request->input('status', 'all');
        $paymentMethod = $request->input('payment_method', 'all');

        $counts = [
            'all'        => Order::count(),
            'pending'    => Order::where('status', 'pending')->count(),
            'confirmed'  => Order::where('status', 'confirmed')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped'    => Order::where('status', 'shipped')->count(),
            'completed'  => Order::where('status', 'completed')->count(),
            'cancelled'  => Order::where('status', 'cancelled')->count(),
        ];

        $query = Order::with(['items.product.images', 'items.product.primaryImage'])->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        if ($status !== 'all' && array_key_exists($status, $counts)) {
            $query->where('status', $status);
        }

        if (in_array($paymentMethod, ['cod', 'qris'])) {
            $query->where('payment_method', $paymentMethod);
        }

        $orders = $query->paginate(15)->withQueryString()->through(function (Order $o) {
            return [
                'id'                => $o->id,
                'order_number'      => $o->order_number,
                'customer_name'     => $o->customer_name,
                'customer_phone'    => $o->customer_phone,
                'customer_address'  => $o->customer_address,
                'payment_method'    => $o->payment_method,
                'payment_proof'     => $o->payment_proof,
                'payment_proof_url' => $o->payment_proof_url,
                'status'            => $o->status,
                'total_price'       => (float) $o->total_price,
                'notes'             => $o->notes,
                'created_at'        => $o->created_at->format('d M Y, H:i'),
                'created_at_human'  => $o->created_at->diffForHumans(),
                'items_count'       => $o->items->count(),
                'items'             => $o->items->map(function ($item) {
                    $product = $item->product;
                    $primaryImg = $product?->primaryImage ?? $product?->images?->first();
                    $imgUrl = null;
                    if ($primaryImg?->url) {
                        $imgUrl = (str_starts_with($primaryImg->url, 'http') || str_starts_with($primaryImg->url, '/'))
                            ? $primaryImg->url
                            : asset('storage/' . ltrim($primaryImg->url, '/'));
                    }

                    return [
                        'id'             => $item->id,
                        'product_id'     => $item->product_id,
                        'product_name'   => $item->product_name,
                        'unit_price'     => (float) $item->unit_price,
                        'quantity'       => $item->quantity,
                        'subtotal_price' => (float) $item->subtotal_price,
                        'image_url'      => $imgUrl,
                    ];
                }),
            ];
        });

        return Inertia::render('MobileAdmin/Orders/Index', [
            'orders'        => $orders,
            'filters'       => [
                'search'         => $search,
                'status'         => $status,
                'payment_method' => $paymentMethod,
            ],
            'counts'        => $counts,
        ]);
    }

    // ── Order Detail ─────────────────────────────────────────
    public function orderShow(Order $order): Response
    {
        $order->load(['items.product.images', 'items.product.primaryImage', 'user']);

        $formatted = [
            'id'                => $order->id,
            'order_number'      => $order->order_number,
            'customer_name'     => $order->customer_name,
            'customer_phone'    => $order->customer_phone,
            'customer_address'  => $order->customer_address,
            'payment_method'    => $order->payment_method,
            'payment_proof'     => $order->payment_proof,
            'payment_proof_url' => $order->payment_proof_url,
            'status'            => $order->status,
            'total_price'       => (float) $order->total_price,
            'notes'             => $order->notes,
            'created_at'        => $order->created_at->format('d M Y, H:i'),
            'created_at_human'  => $order->created_at->diffForHumans(),
            'user'              => $order->user ? [
                'id'    => $order->user->id,
                'name'  => $order->user->name,
                'email' => $order->user->email,
            ] : null,
            'items'             => $order->items->map(function ($item) {
                $product = $item->product;
                $primaryImg = $product?->primaryImage ?? $product?->images?->first();
                $imgUrl = null;
                if ($primaryImg?->url) {
                    $imgUrl = (str_starts_with($primaryImg->url, 'http') || str_starts_with($primaryImg->url, '/'))
                        ? $primaryImg->url
                        : asset('storage/' . ltrim($primaryImg->url, '/'));
                }

                return [
                    'id'             => $item->id,
                    'product_id'     => $item->product_id,
                    'product_name'   => $item->product_name,
                    'unit_price'     => (float) $item->unit_price,
                    'quantity'       => $item->quantity,
                    'subtotal_price' => (float) $item->subtotal_price,
                    'image_url'      => $imgUrl,
                ];
            }),
        ];

        return Inertia::render('MobileAdmin/Orders/Show', [
            'order' => $formatted,
        ]);
    }

    // ── Update Order Status ──────────────────────────────────
    public function orderUpdateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,completed,cancelled',
        ]);

        $statusLabels = [
            'pending'    => 'Menunggu Konfirmasi',
            'confirmed'  => 'Dikonfirmasi',
            'processing' => 'Diproses',
            'shipped'    => 'Dikirim',
            'completed'  => 'Selesai',
            'cancelled'  => 'Dibatalkan',
        ];

        $order->update(['status' => $validated['status']]);

        $label = $statusLabels[$validated['status']] ?? $validated['status'];

        return back()->with('success', "Status pesanan #{$order->order_number} berhasil diubah menjadi {$label}.");
    }

    // ── Delete Order ─────────────────────────────────────────
    public function orderDestroy(Order $order): RedirectResponse
    {
        $orderNumber = $order->order_number;
        $order->delete();

        return redirect()->route('admin.orders')->with('success', "Pesanan #{$orderNumber} berhasil dihapus.");
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
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock_status'   => 'required|in:available,preorder,out_of_stock',
            'category'       => 'nullable|string',
            'description'    => 'nullable|string',
            'is_published'   => 'boolean',
            'images'         => 'nullable|array|max:10',
            'images.*'       => 'image|max:5120',
        ]);

        $product = Product::create([
            'name'           => $data['name'],
            'price'          => $data['price'],
            'original_price' => !empty($data['original_price']) ? $data['original_price'] : null,
            'stock_status'   => $data['stock_status'],
            'category'       => $data['category'] ?? 'lainnya',
            'description'    => $data['description'] ?? null,
            'short_description' => $data['description'] ?? '',
            'is_published'   => $request->boolean('is_published', true),
        ]);

        $uploadedImages = $request->file('images', []);
        if ($uploadedImages) {
            $imageService = app(ImageService::class);
            foreach ($uploadedImages as $index => $image) {
                $paths = $imageService->handleUpload($image, ImageService::PRODUCT_DIRECTORY);
                if (!empty($paths['url'])) {
                    $product->images()->create([
                        'url'        => $paths['url'],
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
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
                'id'             => $product->id,
                'name'           => $product->name,
                'price'          => (int) $product->price,
                'original_price' => $product->original_price ? (int) $product->original_price : null,
                'stock_status'   => $product->stock_status,
                'category'       => $product->category,
                'description'    => $product->description,
                'is_published'   => (bool) $product->is_published,
                'images'         => $product->images->map(fn ($image) => [
                    'id'  => $image->id,
                    'url' => $image->url,
                        'is_primary' => $image->is_primary,
                    ])->values(),
            ],
            'categories' => $this->getProductCategories(),
        ]);
    }

    // ── Update Product ───────────────────────────────────────
    public function productUpdate(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255|min:3',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock_status'   => 'required|in:available,preorder,out_of_stock',
            'category'       => 'nullable|string',
            'description'    => 'nullable|string',
            'is_published'   => 'boolean',
            'images'         => 'nullable|array|max:10',
            'images.*'       => 'image|max:5120',
        ]);

        $product->update([
            'name'           => $data['name'],
            'price'          => $data['price'],
            'original_price' => !empty($data['original_price']) ? $data['original_price'] : null,
            'stock_status'   => $data['stock_status'],
            'category'       => $data['category'] ?? 'lainnya',
            'description'    => $data['description'] ?? null,
            'short_description' => $data['description'] ?? '',
            'is_published'   => $request->boolean('is_published', true),
        ]);

        $uploadedImages = $request->file('images', []);
        if ($uploadedImages) {
            $imageService = app(ImageService::class);
            $nextSortOrder = (int) $product->images()->max('sort_order') + 1;
            $hasPrimary = $product->images()->where('is_primary', true)->exists();
            foreach ($uploadedImages as $index => $image) {
                $paths = $imageService->handleUpload($image, ImageService::PRODUCT_DIRECTORY);
                if (!empty($paths['url'])) {
                    $product->images()->create([
                        'url'        => $paths['url'],
                        'is_primary' => ! $hasPrimary && $index === 0,
                        'sort_order' => $nextSortOrder + $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products')->with('success', 'Produk berhasil diperbarui.');
    }

    public function productImageDestroy(Product $product, ProductImage $productImage): RedirectResponse
    {
        abort_unless($productImage->product_id === $product->id, 404);

        $productImage->delete();

        return back()->with('success', 'Gambar produk berhasil dihapus.');
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
            'is_hero'      => 'boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $paths = app(ImageService::class)->handleUpload($request->file('image'), ImageService::ARTICLE_DIRECTORY);
            $imagePath = $paths['url'] ?? null;
        }

        Article::create([
            'title'        => $data['title'],
            'excerpt'      => $data['excerpt'] ?? null,
            'content'      => $data['content'],
            'image'        => $imagePath,
            'is_published' => $request->boolean('is_published', true),
            'is_hero'      => $request->boolean('is_hero'),
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
                'is_hero'      => (bool) $article->is_hero,
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
            'is_hero'      => 'boolean',
            'image'        => 'nullable|image|max:5120',
        ]);

        $updateData = [
            'title'        => $data['title'],
            'excerpt'      => $data['excerpt'] ?? null,
            'content'      => $data['content'],
            'is_published' => $request->boolean('is_published', true),
            'is_hero'      => $request->boolean('is_hero'),
        ];

        if ($request->boolean('is_published') && ! $article->published_at) {
            $updateData['published_at'] = now();
        }

        if ($request->hasFile('image')) {
            if ($article->image) {
                app(ImageService::class)->deleteIfExists($article->image);
            }
            $paths = app(ImageService::class)->handleUpload($request->file('image'), ImageService::ARTICLE_DIRECTORY);
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

        $reviews = Review::with('product')
            ->when($filter === 'pending', fn ($q) => $q->where('is_approved', false))
            ->when($filter === 'approved', fn ($q) => $q->where('is_approved', true))
            ->latest()
            ->paginate(20)
            ->through(fn ($r) => [
                'id'           => $r->id,
                'author_name'  => $r->name ?: 'Pelanggan',
                'name'         => $r->name ?: 'Pelanggan',
                'city'         => $r->city,
                'rating'       => $r->rating,
                'body'         => $r->review ?: '',
                'review'       => $r->review ?: '',
                'product_name' => $r->product?->name,
                'is_approved'  => $r->is_approved,
                'created_at'   => $r->created_at->format('d M Y'),
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
                'shop_email'   => $settings->email,
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
            'logo'         => 'nullable|image|max:5120',
            'qris_image'   => 'nullable|image|max:5120',
        ]);

        $settings = ShopSetting::getSettings();
        $settings->shop_name = $data['shop_name'];
        $settings->email = $data['shop_email'] ?? null;
        $settings->hero_banner_text_1 = $data['shop_tagline'] ?? null;
        $settings->description = $data['shop_tagline'] ?? null;
        $settings->whatsapp_number = $data['shop_phone'] ?? '';
        if (isset($data['shop_address'])) {
            $settings->address = $data['shop_address'];
        }
        $imageService = app(ImageService::class);
        foreach (['logo', 'qris_image'] as $field) {
            if ($request->hasFile($field)) {
                $path = $imageService->handleUpload(
                    $request->file($field),
                    $field === 'logo' ? ImageService::LOGO_DIRECTORY : ImageService::QRIS_DIRECTORY
                )['url'] ?? null;
                if ($path) {
                    $settings->{$field} = $path;
                }
            }
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
