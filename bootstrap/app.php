<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

$basePath = dirname(__DIR__);

/**
 * AUTO-DETECT LOKASI PUBLIC PATH untuk shared hosting.
 * Hasil deteksi disimpan ke global $GLOBALS['APP_PUBLIC_PATH_DETECTED'],
 * lalu akan dipakai oleh AppServiceProvider untuk bind ke container.
 *
 * Struktur hosting Aeron Host Anda:
 *   /home/user/
 *     ├── agus-meubel/    ← Laravel (basePath)
 *     └── public_html/    ← DocumentRoot web (tempat index.php sesungguhan)
 */
$detectPublicPath = function () use ($basePath): ?string {
    // 1. Prioritas 1: Override eksplisit dari .env
    if (!empty($_ENV['APP_PUBLIC_PATH']) && is_dir($_ENV['APP_PUBLIC_PATH'])) {
        return $_ENV['APP_PUBLIC_PATH'];
    }

    // 2. Cek apakah public/ di dalam project adalah folder public aktif
    //    (normal lokal, VPS, atau hosting dengan document root = project/public)
    $projectPublic = $basePath . '/public';
    if (is_file($projectPublic . '/index.php')) {
        $idx = @file_get_contents($projectPublic . '/index.php');
        if ($idx === false || !preg_match('#require(_once)?\s*\(?\s*[\'"]\.\./bootstrap/app\.php[\'"]#', $idx)) {
            return $projectPublic;
        }
    }

    // 3. SHARED HOSTING DETECTION: cek public_html, www, htdocs di parent basePath
    $parentDir = dirname($basePath);
    $candidates = [
        $parentDir . '/public_html',
        $parentDir . '/www',
        $parentDir . '/htdocs',
        $parentDir . '/web',
    ];
    foreach ($candidates as $cand) {
        if (is_dir($cand) && is_file($cand . '/index.php')) {
            return $cand;
        }
    }

    return $projectPublic; // Fallback akhir: project/public
};

// Simpan hasil deteksi ke GLOBAL agar AppServiceProvider bisa mengaksesnya
$detectedPublicPath = $detectPublicPath();
$GLOBALS['APP_PUBLIC_PATH_DETECTED'] = $detectedPublicPath;

/** @var Application $app */
$app = Application::configure(basePath: $basePath)
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO |
                Request::HEADER_X_FORWARDED_AWS_ELB
        );

        $middleware->trustHosts();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();

// ============================================================
// OVERRIDE PUBLIC PATH (CARA PALING AWAL & TERCEPAT)
// Override langsung di $app instance SEBELUM dikembalikan.
// Ini work di SEMUA versi Laravel tanpa perlu withPublicPath().
// ============================================================
if ($detectedPublicPath !== null && is_dir($detectedPublicPath)) {
    $app->instance('path.public', $detectedPublicPath);

    // Kalau app punya method usePublicPath (Laravel 10+)
    if (method_exists($app, 'usePublicPath')) {
        try {
            $app->usePublicPath($detectedPublicPath);
        } catch (\Throwable) {
        }
    }

    // Override juga storage public root (jika PUBLIC_STORAGE_PATH di env)
    $storagePublicEnv = env('PUBLIC_STORAGE_PATH');
    if ($storagePublicEnv && is_dir($storagePublicEnv) && $app->bound('config')) {
        $app['config']->set('filesystems.disks.public.root', $storagePublicEnv);
    }
}

return $app;
