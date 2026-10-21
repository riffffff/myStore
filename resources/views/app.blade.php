<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- ─── Shop Settings & Favicon ───────────────────────────────────── --}}
        @php
            try {
                $settings     = \App\Models\ShopSetting::getSettings();
                $faviconUrl   = $settings->getFaviconUrl();
                $logoLightUrl = $settings->getLogoUrl('light');
                $logoDarkUrl  = $settings->getLogoUrl('dark');
                $fontUrl      = $settings->getFontUrl();
                $__shopGlobal = [
                    'shop_name'     => $settings->shop_name,
                    'logo_url'      => $logoLightUrl,
                    'logo_dark_url' => $logoDarkUrl,
                    'favicon_url'   => $faviconUrl,
                ];
            } catch (\Throwable) {
                $settings     = null;
                $faviconUrl   = null;
                $logoLightUrl = null;
                $logoDarkUrl  = null;
                $fontUrl      = null;
                $__shopGlobal = null;
            }
        @endphp

        <title inertia>{{ $settings?->shop_name ?? config('app.name', 'PaiTech') }}</title>

        {{-- Inject shop globals for SSR hydration --}}
        @if ($__shopGlobal)
        <script>window.__SHOP__ = @json($__shopGlobal);</script>
        @endif

        {{-- Favicon --}}
        @if ($faviconUrl)
        <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">
        <link rel="apple-touch-icon" href="{{ $faviconUrl }}">
        @endif

        {{-- ─── Google Fonts (dynamic, selected by admin) ────────────────── --}}
        @if ($fontUrl)
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="{{ $fontUrl }}" rel="stylesheet">
        @endif

        {{-- ─── Scripts ───────────────────────────────────────────────────── --}}
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="antialiased font-theme">
        @inertia
    </body>
</html>
