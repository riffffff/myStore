<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * @mixin Builder
 *
 * @property int         $id
 * @property string      $shop_name
 * @property string|null $description
 * @property string|null $logo
 * @property string|null $logo_dark
 * @property string|null $favicon
 * @property string|null $address
 * @property string      $whatsapp_number
 * @property string      $whatsapp_template
 * @property string|null $operating_hours
 * @property string|null $hero_banner_text_1
 * @property string|null $hero_banner_text_2
 * @property string|null $hero_banner_bg
 * @property array|null  $shipping_areas
 * @property string|null $shipping_estimate_days
 * @property string      $theme_primary_color
 * @property string      $theme_secondary_color
 * @property string      $theme_accent_color
 * @property string      $theme_background_color
 * @property string      $theme_background_dark_color
 * @property string      $theme_text_color
 * @property string      $theme_text_light_color
 * @property string      $theme_success_color
 * @property string      $theme_error_color
 * @property string      $theme_warning_color
 * @property string      $theme_info_color
 * @property string      $theme_border_radius
 * @property string      $theme_font_family
 * @property bool        $theme_dark_mode_enabled
 */
class ShopSetting extends Model
{
    use HasFactory;

    // ─── Singleton ────────────────────────────────────────────────────────────

    public const SINGLETON_ID = 1;

    // ─── Cache ───────────────────────────────────────────────────────────────

    public const CACHE_KEY = 'shop_settings';
    public const CACHE_TTL = 600; // 10 menit

    // ─── Font Map ─────────────────────────────────────────────────────────────

    /**
     * Mapping font slug → {name, Google Fonts URL, CSS fallback}.
     * Digunakan oleh getFontUrl() dan getFontFamily().
     */
    private const FONT_MAP = [
        'inter' => [
            'name'     => 'Inter',
            'url'      => 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'fallback' => 'system-ui, -apple-system, sans-serif',
        ],
        'roboto' => [
            'name'     => 'Roboto',
            'url'      => 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
            'fallback' => 'Arial, sans-serif',
        ],
        'poppins' => [
            'name'     => 'Poppins',
            'url'      => 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
            'fallback' => 'system-ui, sans-serif',
        ],
        'montserrat' => [
            'name'     => 'Montserrat',
            'url'      => 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
            'fallback' => 'Arial, sans-serif',
        ],
        'open-sans' => [
            'name'     => 'Open Sans',
            'url'      => 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
            'fallback' => 'Arial, sans-serif',
        ],
        'lato' => [
            'name'     => 'Lato',
            'url'      => 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
            'fallback' => 'Arial, sans-serif',
        ],
        'raleway' => [
            'name'     => 'Raleway',
            'url'      => 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
            'fallback' => 'Arial, sans-serif',
        ],
        'nunito' => [
            'name'     => 'Nunito',
            'url'      => 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap',
            'fallback' => 'system-ui, sans-serif',
        ],
        'source-sans' => [
            'name'     => 'Source Sans 3',
            'url'      => 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&display=swap',
            'fallback' => 'Arial, sans-serif',
        ],
        'work-sans' => [
            'name'     => 'Work Sans',
            'url'      => 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap',
            'fallback' => 'system-ui, sans-serif',
        ],
        'playfair' => [
            'name'     => 'Playfair Display',
            'url'      => 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
            'fallback' => 'Georgia, serif',
        ],
        'merriweather' => [
            'name'     => 'Merriweather',
            'url'      => 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
            'fallback' => 'Georgia, serif',
        ],
        'system' => [
            'name'     => 'System Default',
            'url'      => null, // No external font loaded
            'fallback' => 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        ],
    ];

    // ─── Fillable ─────────────────────────────────────────────────────────────

    protected $fillable = [
        // Shop info
        'shop_name',
        'description',
        'logo',
        'logo_dark',
        'favicon',
        'address',
        'whatsapp_number',
        'whatsapp_template',
        'qris_image',
        'qris_account_name',
        'operating_hours',
        'hero_banner_text_1',
        'hero_banner_text_2',
        'hero_banner_bg',
        'shipping_areas',
        'shipping_estimate_days',

        // Theme colors
        'theme_primary_color',
        'theme_secondary_color',
        'theme_accent_color',
        'theme_background_color',
        'theme_background_dark_color',
        'theme_text_color',
        'theme_text_light_color',
        'theme_success_color',
        'theme_error_color',
        'theme_warning_color',
        'theme_info_color',

        // Theme options
        'theme_border_radius',
        'theme_font_family',
        'theme_dark_mode_enabled',

        // Component-specific theme colors
        'header_bg_color',
        'header_text_color',
        'header_active_color',
        'footer_bg_color',
        'footer_text_color',
        'footer_accent_color',
        'hero_bg_color',
        'hero_text_color',
        'hero_btn_color',
        'hero_btn_text_color',
        'card_product_bg_color',
        'card_product_border_color',
        'card_product_text_color',
        'card_product_price_color',
        'card_product_btn_color',
        'card_article_bg_color',
        'card_article_border_color',
        'card_article_tag_color',
        'card_article_title_color',
        'card_article_text_color',
        'page_bg_color',
        'page_text_color',
        'primary_btn_color',
        'primary_btn_text_color',
    ];

    // ─── Casts ───────────────────────────────────────────────────────────────

    protected $casts = [
        'shipping_areas'          => 'array',
        'theme_dark_mode_enabled' => 'boolean',
    ];

    // ─── Mutators ─────────────────────────────────────────────────────────────

    public function setLogoAttribute($value): void
    {
        $this->attributes['logo'] = is_string($value) ? ltrim($value, '/') : $value;
    }

    public function setLogoDarkAttribute($value): void
    {
        $this->attributes['logo_dark'] = is_string($value) ? ltrim($value, '/') : $value;
    }

    public function setFaviconAttribute($value): void
    {
        $this->attributes['favicon'] = is_string($value) ? ltrim($value, '/') : $value;
    }

    public function setHeroBannerBgAttribute($value): void
    {
        $this->attributes['hero_banner_bg'] = is_string($value) ? ltrim($value, '/') : $value;
    }

    public function setQrisImageAttribute($value): void
    {
        $this->attributes['qris_image'] = is_string($value) ? ltrim($value, '/') : $value;
    }

    // ─── Save (Singleton Override) ────────────────────────────────────────────

    /**
     * Override save() untuk memastikan hanya ada 1 baris (singleton ID=1),
     * dan otomatis membersihkan cache setiap kali data berubah.
     */
    public function save(array $options = []): bool
    {
        $this->id = self::SINGLETON_ID;
        $this->applyDefaults();

        try {
            $existsNow = DB::table($this->getTable())->where('id', self::SINGLETON_ID)->exists();
        } catch (\Throwable) {
            $existsNow = false;
        }
        $this->exists = $existsNow;

        $result = parent::save($options);

        // Hapus cache agar data terbaru diambil pada request berikutnya
        Cache::forget(self::CACHE_KEY);

        return $result;
    }

    // ─── Defaults ─────────────────────────────────────────────────────────────

    /**
     * Terapkan nilai default untuk field yang kosong.
     */
    private function applyDefaults(): void
    {
        // ── WhatsApp ────────────────────────────────────────────────────────
        if (empty($this->whatsapp_number)) {
            $this->whatsapp_number = '6281234567890';
        }
        $this->whatsapp_number = preg_replace('/[^0-9]/', '', (string) $this->whatsapp_number);
        if (str_starts_with($this->whatsapp_number, '0')) {
            $this->whatsapp_number = '62' . substr($this->whatsapp_number, 1);
        }
        if (str_starts_with($this->whatsapp_number, '8')) {
            $this->whatsapp_number = '62' . $this->whatsapp_number;
        }

        if (empty($this->whatsapp_template)) {
            $this->whatsapp_template = 'Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?';
        }

        // ── Shop Info ───────────────────────────────────────────────────────
        if (empty($this->shop_name)) {
            $this->shop_name = 'PaiTech';
        }

        if (empty($this->description)) {
            $this->description = 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.';
        }

        // ── Theme Colors ────────────────────────────────────────────────────
        $this->theme_primary_color          ??= '#0D9488';
        $this->theme_secondary_color        ??= '#8B5CF6';
        $this->theme_accent_color           ??= '#F59E0B';
        $this->theme_background_color       ??= '#FFFFFF';
        $this->theme_background_dark_color  ??= '#111827';
        $this->theme_text_color             ??= '#1F2937';
        $this->theme_text_light_color       ??= '#6B7280';
        $this->theme_success_color          ??= '#10B981';
        $this->theme_error_color            ??= '#EF4444';
        $this->theme_warning_color          ??= '#F59E0B';
        $this->theme_info_color             ??= '#3B82F6';

        // ── Component Theme Colors ──────────────────────────────────────────
        $this->header_bg_color             ??= '#333333';
        $this->header_text_color           ??= '#FFFFFF';
        $this->header_active_color         ??= '#0D9488';
        $this->footer_bg_color             ??= '#262626';
        $this->footer_text_color           ??= '#9CA3AF';
        $this->footer_accent_color         ??= '#0D9488';
        $this->hero_bg_color               ??= '#F1F1F1';
        $this->hero_text_color             ??= '#262626';
        $this->hero_btn_color              ??= '#0D9488';
        $this->hero_btn_text_color         ??= '#FFFFFF';
        $this->card_product_bg_color       ??= '#FFFFFF';
        $this->card_product_border_color   ??= '#E5E7EB';
        $this->card_product_text_color     ??= '#262626';
        $this->card_product_price_color    ??= '#262626';
        $this->card_product_btn_color      ??= '#0D9488';
        $this->card_article_bg_color       ??= '#FFFFFF';
        $this->card_article_border_color   ??= '#E5E7EB';
        $this->card_article_tag_color      ??= '#0D9488';
        $this->card_article_title_color    ??= '#262626';
        $this->card_article_text_color     ??= '#4B5563';
        $this->page_bg_color               ??= '#FFFFFF';
        $this->page_text_color             ??= '#262626';
        $this->primary_btn_color           ??= '#0D9488';
        $this->primary_btn_text_color      ??= '#FFFFFF';

        // ── Theme Options ───────────────────────────────────────────────────
        if (empty($this->theme_border_radius)) {
            $this->theme_border_radius = '0.5rem';
        }
        if (empty($this->theme_font_family)) {
            $this->theme_font_family = 'inter';
        }
        if (! isset($this->theme_dark_mode_enabled)) {
            $this->theme_dark_mode_enabled = true;
        }
    }

    // ─── Static Accessors ─────────────────────────────────────────────────────

    /**
     * Ambil setting toko dari cache atau DB.
     * Jika belum ada di DB, buat dengan nilai default (singleton).
     */
    public static function getSettings(): self
    {
        $cached = Cache::get(self::CACHE_KEY);
        if ($cached instanceof self) {
            return $cached;
        }

        $settings = static::query()->find(self::SINGLETON_ID);

        if ($settings === null) {
            $settings = new static();
            $settings->forceFill([
                'id'                        => self::SINGLETON_ID,
                'shop_name'                 => 'PaiTech',
                'description'               => 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.',
                'logo'                      => null,
                'logo_dark'                 => null,
                'favicon'                   => null,
                'address'                   => 'Indonesia',
                'whatsapp_number'           => '6281234567890',
                'whatsapp_template'         => 'Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?',
                'operating_hours'           => 'Senin - Sabtu: 08:00 - 17:00',
                'hero_banner_text_1'        => 'Teknologi & Produk Berkualitas',
                'hero_banner_text_2'        => 'Solusi digital untuk transformasi bisnis Anda',
                'hero_banner_bg'            => null,
                'shipping_areas'            => ['Seluruh Indonesia'],
                'shipping_estimate_days'    => '7 - 14 hari kerja',
                // Theme defaults
                'theme_primary_color'       => '#3B82F6',
                'theme_secondary_color'     => '#8B5CF6',
                'theme_accent_color'        => '#F59E0B',
                'theme_background_color'    => '#FFFFFF',
                'theme_background_dark_color' => '#111827',
                'theme_text_color'          => '#1F2937',
                'theme_text_light_color'    => '#6B7280',
                'theme_success_color'       => '#10B981',
                'theme_error_color'         => '#EF4444',
                'theme_warning_color'       => '#F59E0B',
                'theme_info_color'          => '#3B82F6',
                'theme_border_radius'       => '0.5rem',
                'theme_font_family'         => 'inter',
                'theme_dark_mode_enabled'   => true,
            ]);
            $settings->save();
        }

        Cache::put(self::CACHE_KEY, $settings, self::CACHE_TTL);

        return $settings;
    }

    /**
     * Hapus cache setting toko secara manual.
     */
    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    // ─── Theme Helper Methods ─────────────────────────────────────────────────

    /**
     * Kembalikan semua theme colors dalam format array.
     * Digunakan oleh Inertia middleware untuk di-share ke frontend.
     *
     * @return array<string, mixed>
     */
    public function getThemeColors(): array
    {
        return [
            // Generic / Base
            'primary'                 => $this->theme_primary_color ?? '#0D9488',
            'secondary'               => $this->theme_secondary_color ?? '#8B5CF6',
            'accent'                  => $this->theme_accent_color ?? '#F59E0B',
            'background'              => $this->theme_background_color ?? '#FFFFFF',
            'backgroundDark'          => $this->theme_background_dark_color ?? '#111827',
            'text'                    => $this->theme_text_color ?? '#1F2937',
            'textLight'               => $this->theme_text_light_color ?? '#6B7280',
            'success'                 => $this->theme_success_color ?? '#10B981',
            'error'                   => $this->theme_error_color ?? '#EF4444',
            'warning'                 => $this->theme_warning_color ?? '#F59E0B',
            'info'                    => $this->theme_info_color ?? '#3B82F6',
            'borderRadius'            => $this->theme_border_radius ?? '0.5rem',
            'fontFamily'              => $this->getFontFamily(),
            'darkModeEnabled'         => $this->theme_dark_mode_enabled ?? true,

            // Section / Component Specific Colors
            'headerBg'                => $this->header_bg_color ?? '#333333',
            'headerText'              => $this->header_text_color ?? '#FFFFFF',
            'headerActive'            => $this->header_active_color ?? '#0D9488',
            'footerBg'                => $this->footer_bg_color ?? '#262626',
            'footerText'              => $this->footer_text_color ?? '#9CA3AF',
            'footerAccent'            => $this->footer_accent_color ?? '#0D9488',
            'heroBg'                  => $this->hero_bg_color ?? '#F1F1F1',
            'heroText'                => $this->hero_text_color ?? '#262626',
            'heroBtn'                 => $this->hero_btn_color ?? '#0D9488',
            'heroBtnText'             => $this->hero_btn_text_color ?? '#FFFFFF',
            'cardProductBg'           => $this->card_product_bg_color ?? '#FFFFFF',
            'cardProductBorder'       => $this->card_product_border_color ?? '#E5E7EB',
            'cardProductText'         => $this->card_product_text_color ?? '#262626',
            'cardProductPrice'        => $this->card_product_price_color ?? '#262626',
            'cardProductBtn'          => $this->card_product_btn_color ?? '#0D9488',
            'cardArticleBg'           => $this->card_article_bg_color ?? '#FFFFFF',
            'cardArticleBorder'       => $this->card_article_border_color ?? '#E5E7EB',
            'cardArticleTag'          => $this->card_article_tag_color ?? '#0D9488',
            'cardArticleTitle'        => $this->card_article_title_color ?? '#262626',
            'cardArticleText'         => $this->card_article_text_color ?? '#4B5563',
            'pageBg'                  => $this->page_bg_color ?? '#FFFFFF',
            'pageText'                => $this->page_text_color ?? '#262626',
            'primaryBtn'              => $this->primary_btn_color ?? '#0D9488',
            'primaryBtnText'          => $this->primary_btn_text_color ?? '#FFFFFF',
        ];
    }

    /**
     * Kembalikan URL Google Fonts untuk font yang dipilih, atau null untuk System Default.
     */
    public function getFontUrl(): ?string
    {
        $slug = $this->theme_font_family ?? 'inter';

        return self::FONT_MAP[$slug]['url'] ?? self::FONT_MAP['inter']['url'];
    }

    /**
     * Kembalikan string CSS font-family lengkap (termasuk fallback).
     */
    public function getFontFamily(): string
    {
        $slug     = $this->theme_font_family ?? 'inter';
        $fontData = self::FONT_MAP[$slug] ?? self::FONT_MAP['inter'];

        if (! empty($fontData['url'])) {
            return "'{$fontData['name']}', {$fontData['fallback']}";
        }

        // System Default — tidak perlu kutip
        return $fontData['fallback'];
    }

    // ─── URL Helper Methods ───────────────────────────────────────────────────

    /**
     * Get logo URL dengan fallback ke default.
     *
     * @param string $mode 'light' | 'dark'
     */
    public function getLogoUrl(string $mode = 'light'): string
    {
        $logoField = $mode === 'dark' ? 'logo_dark' : 'logo';

        if (! empty($this->$logoField)) {
            return asset('storage/' . $this->$logoField);
        }

        $defaultLogo = $mode === 'dark'
            ? 'storage/logo/logo-dark.jpeg'
            : 'storage/logo/logo.jpeg';

        if (file_exists(public_path($defaultLogo))) {
            return asset($defaultLogo);
        }

        // Fallback ke light mode logo untuk dark
        if ($mode === 'dark' && file_exists(public_path('storage/logo/logo.jpeg'))) {
            return asset('storage/logo/logo.jpeg');
        }

        // Ultimate fallback: placeholder SVG dengan nama toko
        return 'data:image/svg+xml,' . rawurlencode(
            '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">'
            . '<rect width="120" height="40" fill="#3B82F6"/>'
            . '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" '
            . 'font-family="sans-serif" font-size="14" font-weight="bold">'
            . htmlspecialchars($this->shop_name ?? 'PaiTech')
            . '</text></svg>'
        );
    }

    /**
     * Get favicon URL dengan fallback.
     */
    public function getFaviconUrl(): string
    {
        if (! empty($this->favicon)) {
            return asset('storage/' . $this->favicon);
        }

        if (file_exists(public_path('storage/logo/favicon.png'))) {
            return asset('storage/logo/favicon.png');
        }

        return $this->getLogoUrl('light');
    }

    /**
     * Get QRIS image URL dengan fallback placeholder SVG.
     */
    public function getQrisImageUrl(): ?string
    {
        if (! empty($this->qris_image)) {
            return asset('storage/' . $this->qris_image);
        }

        if (file_exists(public_path('storage/qris/qris.png'))) {
            return asset('storage/qris/qris.png');
        }

        return null;
    }
}
