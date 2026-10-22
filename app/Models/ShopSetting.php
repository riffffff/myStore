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
 * @property string|null $email
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
     * Digunakan oleh ThemeSetting model.
     */
    public const FONT_MAP = [
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
        'email',
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
    ];

    // ─── Casts ───────────────────────────────────────────────────────────────

    protected $casts = [
        'shipping_areas'          => 'array',
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
        return ThemeSetting::getSingleton()->getThemeColors();
    }

    /**
     * Kembalikan URL Google Fonts untuk font yang dipilih, atau null untuk System Default.
     */
    public function getFontUrl(): ?string
    {
        return ThemeSetting::getSingleton()->getFontUrl();
    }

    /**
     * Kembalikan string CSS font-family lengkap (termasuk fallback).
     */
    public function getFontFamily(): string
    {
        return ThemeSetting::getSingleton()->getFontFamily();
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
            if (str_starts_with($this->qris_image, 'http')) {
                return $this->qris_image;
            }
            return '/storage/' . ltrim($this->qris_image, '/');
        }

        if (file_exists(public_path('storage/qris/qris.png'))) {
            return '/storage/qris/qris.png';
        }

        return null;
    }
}
