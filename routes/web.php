<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    ProductController,
    ArticleController,
    CartController,
    ProfileController,
    ReviewController,
    OrderController
};
use App\Models\Article;
use App\Models\Product;

// ===== SEO ROUTES =====

Route::get('/robots.txt', function () {
    return response("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /profile\nDisallow: /keranjang\nDisallow: /cart\nDisallow: /login\nDisallow: /register\nSitemap: " . url('/sitemap.xml') . "\n", 200, [
        'Content-Type' => 'text/plain; charset=UTF-8',
    ]);
})->name('robots');

Route::get('/sitemap.xml', function () {
    $urls = collect([
        ['loc' => route('home'), 'lastmod' => now()],
        ['loc' => route('products.index'), 'lastmod' => null],
        ['loc' => route('articles.index'), 'lastmod' => null],
    ]);

    Product::where('is_published', true)
        ->get(['slug', 'updated_at'])
        ->each(fn (Product $product) => $urls->push([
            'loc' => route('products.show', $product->slug),
            'lastmod' => $product->updated_at,
        ]));

    Article::published()
        ->get(['slug', 'updated_at'])
        ->each(fn (Article $article) => $urls->push([
            'loc' => route('articles.show', $article->slug),
            'lastmod' => $article->updated_at,
        ]));

    $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    foreach ($urls as $url) {
        $xml .= '<url><loc>' . e($url['loc']) . '</loc>';
        if ($url['lastmod']) {
            $xml .= '<lastmod>' . $url['lastmod']->toAtomString() . '</lastmod>';
        }
        $xml .= '</url>';
    }
    $xml .= '</urlset>';

    return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
})->name('sitemap');

// ===== STORAGE FALLBACK ROUTE =====
/**
 * FALLBACK UNTUK SHARED HOSTING TANPA SYMLINK.
 * Jika php artisan storage:link / symlink TIDAK BISA di hosting,
 * route ini akan menangani request /storage/{path}
 * dengan membaca file dari storage/app/public secara langsung.
 */
Route::get('/storage/{path}', function (string $path) {
    $cleanPath = ltrim($path, '/\\');
    $candidates = array_filter([
        storage_path('app/public/' . $cleanPath),
        public_path('storage/' . $cleanPath),
        env('PUBLIC_STORAGE_PATH') ? rtrim(env('PUBLIC_STORAGE_PATH'), '/\\') . '/' . $cleanPath : null,
    ]);

    $fullPath = null;
    foreach ($candidates as $candidate) {
        if (is_file($candidate)) {
            $fullPath = $candidate;
            break;
        }
    }

    if (! $fullPath) {
        abort(404);
    }

    $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
    $mimeTypes = [
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'pdf'  => 'application/pdf',
        'css'  => 'text/css',
        'js'   => 'application/javascript',
    ];
    $mime = $mimeTypes[$extension] ?? mime_content_type($fullPath) ?: 'application/octet-stream';
    $maxAge = 60 * 60 * 24 * 30; // 30 hari cache

    return response()->file($fullPath, [
        'Content-Type'  => $mime,
        'Cache-Control' => 'public, max-age=' . $maxAge . ', immutable',
        'Expires'       => gmdate('D, d M Y H:i:s', time() + $maxAge) . ' GMT',
    ]);
})->where('path', '.*')->name('storage.fallback');

// ===== PUBLIC ROUTES (No Auth Required) =====
// Rate limited untuk mencegah scraping & DoS
Route::middleware('throttle:public')->group(function () {
    Route::get('/', HomeController::class)->name('home');
    
    Route::prefix('produk')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
    });
    
    Route::prefix('artikel')->name('articles.')->group(function () {
        Route::get('/', [ArticleController::class, 'index'])->name('index');
        Route::get('/{slug}', [ArticleController::class, 'show'])->name('show');
    });
});

// Submit review publik — tidak perlu login, rate limited 3/hari per IP
Route::post('/review', [ReviewController::class, 'store'])
    ->middleware('throttle:review')
    ->name('reviews.store');

// Lacak status pesanan & halaman sukses pesanan (Publik)
Route::get('/pesan/status', [OrderController::class, 'track'])->name('orders.track');
Route::get('/pesan/sukses/{orderNumber}', [OrderController::class, 'success'])->name('orders.success');

// ===== USER ROUTES (Auth Required) =====
Route::middleware('auth')->group(function () {
    // Checkout & Buat Pesanan
    Route::prefix('pesan')->name('orders.')->controller(OrderController::class)->group(function () {
        Route::get('/', 'create')->name('create');
        Route::post('/', 'store')->name('store');
    });

    // Dashboard redirect
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
        if ($request->user()?->is_admin) {
            return \Inertia\Inertia::location(url('/admin'));
        }
        return redirect('/');
    })->name('dashboard');

    // Profile routes
    Route::prefix('profile')->name('profile.')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    // Cart routes — rate limited lebih ketat untuk mencegah spam
    Route::middleware('throttle:cart')->group(function () {
        Route::prefix('keranjang')->name('cart.')->controller(CartController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/add', 'store')->name('store');
            Route::post('/item/{cartItem}', 'updateQuantity')->name('item.update');
            Route::delete('/item/{cartItem}', 'destroy')->name('item.destroy');
            Route::delete('/clear', 'clear')->name('clear');
        });
        
        // Alternative cart URL (for backward compatibility)
        Route::post('/cart/add', [CartController::class, 'store'])->name('cart.store.alt');
    });
});

// ===== AUTH ROUTES (Laravel Breeze) =====
require __DIR__.'/auth.php';
