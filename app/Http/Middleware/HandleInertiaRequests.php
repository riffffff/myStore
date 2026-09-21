<?php

namespace App\Http\Middleware;

use App\Services\ShopSettingService;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Create a new middleware instance.
     */
    public function __construct(
        private readonly ShopSettingService $shopSettingService
    ) {}

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = $this->shopSettingService->getSettings();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'cart.flash' => fn () => $request->session()->get('cart.flash'),
                'review_submitted' => fn () => $request->session()->get('review_submitted'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'shopSettings' => fn () => [
                'id' => $settings->id,
                'shop_name' => $settings->shop_name,
                'description' => $settings->description,
                'address' => $settings->address,
                'whatsapp_number' => $settings->whatsapp_number,
                'whatsapp_template' => $settings->whatsapp_template,
                'operating_hours' => $settings->operating_hours,
                'hero_banner_text_1' => $settings->hero_banner_text_1,
                'hero_banner_text_2' => $settings->hero_banner_text_2,
                'hero_banner_bg' => $settings->hero_banner_bg,
                'shipping_areas' => $settings->shipping_areas,
                'shipping_estimate_days' => $settings->shipping_estimate_days,
                // URL LOGO & FAVICON (auto fallback via service)
                'logo_url' => $this->shopSettingService->getLogoUrl('light'),
                'logo_dark_url' => $this->shopSettingService->getLogoUrl('dark'),
                'favicon_url' => $this->shopSettingService->getFaviconUrl(),
                // Field path asli (jika diperlukan di frontend)
                'logo' => $settings->logo,
                'logo_dark' => $settings->logo_dark,
                'favicon' => $settings->favicon,
            ],
        ];
    }
}
