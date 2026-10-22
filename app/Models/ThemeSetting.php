<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ThemeSetting extends Model
{
    use HasFactory;

    public const SINGLETON_ID = 1;
    public const CACHE_KEY = 'theme_settings';
    public const CACHE_TTL = 600;

    protected $fillable = [
        'primary_color',
        'secondary_color',
        'accent_color',
        'background_color',
        'background_dark_color',
        'text_color',
        'text_light_color',
        'success_color',
        'error_color',
        'warning_color',
        'info_color',
        'border_radius',
        'font_family',
        'dark_mode_enabled',
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
        'price_color',
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

    protected $casts = [
        'dark_mode_enabled' => 'boolean',
    ];

    /**
     * Kembalikan URL Google Fonts untuk font yang dipilih, atau null untuk System Default.
     */
    public function getFontUrl(): ?string
    {
        $slug = $this->font_family ?? 'inter';

        return ShopSetting::FONT_MAP[$slug]['url'] ?? ShopSetting::FONT_MAP['inter']['url'];
    }

    /**
     * Kembalikan string CSS font-family lengkap (termasuk fallback).
     */
    public function getFontFamily(): string
    {
        $slug     = $this->font_family ?? 'inter';
        $fontData = ShopSetting::FONT_MAP[$slug] ?? ShopSetting::FONT_MAP['inter'];

        if (! empty($fontData['url'])) {
            return "'{$fontData['name']}', {$fontData['fallback']}";
        }

        // System Default — tidak perlu kutip
        return $fontData['fallback'];
    }

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
            'primary'                 => $this->primary_color ?? '#0D9488',
            'secondary'               => $this->secondary_color ?? '#333333',
            'accent'                  => $this->accent_color ?? '#0D9488',
            'background'              => $this->background_color ?? '#FFFFFF',
            'backgroundDark'          => $this->background_dark_color ?? '#1A1A1A',
            'text'                    => $this->text_color ?? '#262626',
            'textLight'               => $this->text_light_color ?? '#6B7280',
            'success'                 => $this->success_color ?? '#10B981',
            'error'                   => $this->error_color ?? '#E63854',
            'warning'                 => $this->warning_color ?? '#F59E0B',
            'info'                    => $this->info_color ?? '#0D9488',
            'borderRadius'            => $this->border_radius ?? '0.75rem',
            'fontFamily'              => $this->getFontFamily(),
            'darkModeEnabled'         => $this->dark_mode_enabled ?? true,

            // Section / Component Specific Colors
            'headerBg'                => $this->header_bg_color ?? '#333333',
            'headerText'              => $this->header_text_color ?? '#FFFFFF',
            'headerActive'            => $this->header_active_color ?? '#0D9488',
            'footerBg'                => $this->footer_bg_color ?? '#333333',
            'footerText'              => $this->footer_text_color ?? '#FFFFFF',
            'footerAccent'            => $this->footer_accent_color ?? '#0D9488',
            'heroBg'                  => $this->hero_bg_color ?? '#F1F1F1',
            'heroText'                => $this->hero_text_color ?? '#262626',
            'heroBtn'                 => $this->hero_btn_color ?? '#0D9488',
            'heroBtnText'             => $this->hero_btn_text_color ?? '#FFFFFF',
            'cardProductBg'           => $this->card_product_bg_color ?? '#FFFFFF',
            'cardProductBorder'       => $this->card_product_border_color ?? '#E5E7EB',
            'cardProductText'         => $this->card_product_text_color ?? '#262626',
            'cardProductPrice'        => $this->card_product_price_color ?? '#E63854',
            'priceColor'              => $this->price_color ?? '#E63854',
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

    public static function getSingleton(): self
    {
        $cached = Cache::get(self::CACHE_KEY);
        
        // Cek jika cache ada dan bukan objek yang rusak (incomplete class)
        if ($cached instanceof self) {
            return $cached;
        }

        // Jika tidak ada atau rusak, ambil dari DB dan simpan ulang ke cache
        $theme = self::query()->firstOrCreate(['id' => self::SINGLETON_ID]);
        
        Cache::put(self::CACHE_KEY, $theme, self::CACHE_TTL);

        return $theme;
    }

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget(self::CACHE_KEY);
        });
    }
}
