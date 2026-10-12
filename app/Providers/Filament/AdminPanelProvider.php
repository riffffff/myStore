<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Assets\Css;
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentAsset;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        try {
            $shopSettings = \App\Models\ShopSetting::getSettings();
            $brandName    = ($shopSettings->shop_name ?? 'Store') . ' Admin';
            $brandLogo    = $shopSettings->getLogoUrl('light');
            $favicon      = $shopSettings->getFaviconUrl();
        } catch (\Throwable) {
            $brandName = 'Store Admin';
            $brandLogo = null;
            $favicon   = null;
        }

        $brandLogoHtml = null;
        if ($brandLogo) {
            $brandLogoHtml = new HtmlString(sprintf(
                '<div class="flex items-center gap-3 px-1 py-1 select-none">
                    <img src="%s" alt="%s" style="height: 2.5rem;" class="shrink-0 rounded-sm object-contain">
                    <span class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">%s</span>
                </div>',
                htmlspecialchars($brandLogo, ENT_QUOTES),
                htmlspecialchars($brandName, ENT_QUOTES),
                htmlspecialchars($brandName, ENT_QUOTES)
            ));
        }

        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName($brandName)
            ->when($brandLogoHtml, fn ($p) => $p->brandLogo($brandLogoHtml))
            ->when($favicon, fn ($p) => $p->favicon($favicon))
            ->collapsibleNavigationGroups(false)
            ->colors([
                'primary' => Color::Teal,
                'gray'    => Color::Stone,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                // Default widgets removed for cleaner SaaS dashboard
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->renderHook(
                \Filament\View\PanelsRenderHook::HEAD_END,
                fn () => new \Illuminate\Support\HtmlString('<link rel="stylesheet" href="' . asset('css/filament-admin.css') . '?v=' . (file_exists(public_path('css/filament-admin.css')) ? filemtime(public_path('css/filament-admin.css')) : time()) . '">')
            )
            ->renderHook(
                \Filament\View\PanelsRenderHook::BODY_END,
                fn () => view('filament.components.mobile-bottom-nav')
            )
            ->authMiddleware([
                Authenticate::class,
            ]);
    }

    public function boot(): void
    {
        FilamentAsset::register([
            Css::make('store-admin', public_path('css/filament-admin.css'))
                ->loadedOnRequest(),
        ]);
    }
}
