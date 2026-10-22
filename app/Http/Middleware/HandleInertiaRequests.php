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
        $themeSetting = $this->shopSettingService->getTheme();

        $shopSettings = [
            'id'                    => $settings?->id ?? null,
            'shop_name'             => $settings?->shop_name ?? 'PaiTech',
            'email'                 => $settings?->email,
            'description'           => $settings?->description ?? 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.',
            'address'               => $settings?->address ?? 'Indonesia',
            'whatsapp_number'       => $settings?->whatsapp_number ?? '6281234567890',
            'whatsapp_template'     => $settings?->whatsapp_template ?? '',
            'operating_hours'       => $settings?->operating_hours ?? 'Senin - Sabtu: 08:00 - 17:00',
            'hero_banner_text_1'    => $settings?->hero_banner_text_1 ?? 'Teknologi & Produk Berkualitas',
            'hero_banner_text_2'    => $settings?->hero_banner_text_2 ?? 'Solusi digital untuk transformasi bisnis Anda',
            'hero_banner_bg'        => $settings?->hero_banner_bg ?? null,
            'shipping_areas'        => $settings?->shipping_areas ?? [],
            'shipping_estimate_days' => $settings?->shipping_estimate_days ?? '',
            'logo_url'              => $this->shopSettingService->getLogoUrl('light'),
            'logo_dark_url'         => $this->shopSettingService->getLogoUrl('dark'),
            'favicon_url'           => $this->shopSettingService->getFaviconUrl(),
            'logo'                  => $settings?->logo ?? null,
            'logo_dark'             => $settings?->logo_dark ?? null,
            'favicon'               => $settings?->favicon ?? null,
            'qris_image'            => $settings?->qris_image ?? null,
            'qris_image_url'        => $this->shopSettingService->getQrisImageUrl(),
            'qris_account_name'     => $this->shopSettingService->getQrisAccountName() ?? ($settings?->shop_name ?? 'PaiTech'),
        ];

        // Theme data — lazily evaluated untuk performa
        $theme = fn () => $themeSetting->getThemeColors();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success'          => fn () => $request->session()->get('success'),
                'error'            => fn () => $request->session()->get('error'),
                'cart.flash'       => fn () => $request->session()->get('cart.flash'),
                'review_submitted' => fn () => $request->session()->get('review_submitted'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'shopSettings' => $shopSettings,
            'theme'        => $theme,
            'cart'         => function () use ($request) {
                $user = $request->user();
                if (!$user) {
                    return [
                        'total_quantity' => 0,
                        'items'          => [],
                    ];
                }
                $cart = $user->cart;
                if (!$cart) {
                    return [
                        'total_quantity' => 0,
                        'items'          => [],
                    ];
                }
                return [
                    'total_quantity' => (int) $cart->total_quantity,
                    'items'          => $cart->items()->pluck('quantity', 'product_id')->toArray(),
                ];
            },
        ];
    }
}
