<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\ProductImage;
use App\Models\ShopSetting;
use App\Observers\ArticleObserver;
use App\Observers\ProductImageObserver;
use App\Observers\ShopSettingObserver;
use App\Services\ArticleService;
use App\Services\CartService;
use App\Services\ProductService;
use App\Services\ReviewService;
use App\Services\ShopSettingService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register services as singletons
        $this->app->singleton(ShopSettingService::class);
        $this->app->singleton(CartService::class);
        $this->app->singleton(ProductService::class);
        $this->app->singleton(ArticleService::class);
        $this->app->singleton(ReviewService::class);

        $publicPath = null;

        // Prioritas 1: override eksplisit dari .env
        $envPath = env('APP_PUBLIC_PATH');
        if ($envPath && is_dir($envPath)) {
            $publicPath = $envPath;
        }

        // Prioritas 2: hasil auto-detect dari bootstrap/app.php
        if ($publicPath === null && ! empty($GLOBALS['APP_PUBLIC_PATH_DETECTED'])) {
            $detected = $GLOBALS['APP_PUBLIC_PATH_DETECTED'];
            if (is_dir($detected)) {
                $publicPath = $detected;
            }
        }

        // Override public path via container (fallback jikalau override di bootstrap tidak jalan)
        if ($publicPath !== null) {
            $currentPublic = $this->app->bound('path.public') ? $this->app->make('path.public') : null;
            if ($currentPublic !== $publicPath) {
                $this->app->instance('path.public', $publicPath);
            }

            // Jika pakai Laravel >= 10 yang punya method usePublicPath
            if (method_exists($this->app, 'usePublicPath')) {
                try {
                    /** @var Application $laravelApp */
                    $laravelApp = $this->app;
                    $laravelApp->usePublicPath($publicPath);
                } catch (\Throwable) {
                }
            }
        }

        // Override juga storage public root jika PUBLIC_STORAGE_PATH di-set di .env
        $storagePublic = env('PUBLIC_STORAGE_PATH');
        if ($storagePublic && $this->app->bound('config')) {
            /** @var Repository $config */
            $config = $this->app->make('config');
            $currentRoot = $config->get('filesystems.disks.public.root');
            if ($currentRoot === null || $currentRoot !== $storagePublic) {
                $config->set('filesystems.disks.public.root', $storagePublic);
            }
        }
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $isHttps =
            (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && $_SERVER['HTTPS'] !== 'off') ||
            (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443) ||
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && stripos((string) $_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false) ||
            (isset($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on') ||
            (isset($_SERVER['HTTP_CF_VISITOR']) && strpos((string) $_SERVER['HTTP_CF_VISITOR'], '"scheme":"https"') !== false);

        if ($isHttps) {
            URL::forceScheme('https');
            if (isset($_SERVER)) {
                $_SERVER['HTTPS'] = 'on';
            }
        }

        ProductImage::observe(ProductImageObserver::class);
        Article::observe(ArticleObserver::class);
        ShopSetting::observe(ShopSettingObserver::class);

        $this->configureRateLimiting();
    }

    protected function configureRateLimiting(): void
    {
        // Cart mutation: maks 30 request/menit per user
        RateLimiter::for('cart', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function () {
                    return back()->withErrors([
                        'rate_limit' => 'Terlalu banyak permintaan. Silakan tunggu sebentar.',
                    ]);
                });
        });

        // Halaman publik (produk & artikel): maks 120 request/menit per IP
        RateLimiter::for('public', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });

        // Submit review publik: maks 3 review per 24 jam per IP
        RateLimiter::for('review', function (Request $request) {
            return Limit::perDay(3)
                ->by($request->ip())
                ->response(function () {
                    return back()->withErrors([
                        'rate_limit' => 'Anda telah mencapai batas pengiriman ulasan hari ini. Silakan coba lagi besok.',
                    ]);
                });
        });
    }
}
