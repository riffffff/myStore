<?php

namespace App\Services;

use App\Models\ShopSetting;
use App\Models\ThemeSetting;

/**
 * Service for managing shop settings and caching.
 *
 * Provides centralized access to shop configuration including
 * logos, theme colors, and contact information.
 */
class ShopSettingService
{
    private ?ShopSetting $settings = null;
    private ?ThemeSetting $theme = null;

    /**
     * Get shop settings (cached).
     */
    public function getSettings(): ShopSetting
    {
        if ($this->settings === null) {
            $this->settings = ShopSetting::getSettings();
        }

        return $this->settings;
    }

    /**
     * Get theme settings (cached).
     */
    public function getTheme(): ThemeSetting
    {
        if ($this->theme === null) {
            $this->theme = ThemeSetting::getSingleton();
        }

        return $this->theme;
    }

    /**
     * Clear shop settings cache.
     */
    public function clearCache(): void
    {
        ShopSetting::flushCache();
        \Illuminate\Support\Facades\Cache::forget(ThemeSetting::CACHE_KEY);
        $this->settings = null;
        $this->theme = null;
    }

    /**
     * Get theme colors array.
     */
    public function getThemeColors(): array
    {
        return $this->getTheme()->getThemeColors();
    }

    /**
     * Get logo URL with fallback.
     *
     * @param  string  $mode  'light' or 'dark'
     */
    public function getLogoUrl(string $mode = 'light'): string
    {
        return $this->getSettings()->getLogoUrl($mode);
    }

    /**
     * Get favicon URL with fallback.
     */
    public function getFaviconUrl(): string
    {
        return $this->getSettings()->getFaviconUrl();
    }

    /**
     * Get WhatsApp number.
     */
    public function getWhatsAppNumber(): string
    {
        return $this->getSettings()->whatsapp_number;
    }

    /**
     * Get WhatsApp message template.
     */
    public function getWhatsAppTemplate(): string
    {
        return $this->getSettings()->whatsapp_template;
    }

    /**
     * Get shop name.
     */
    public function getShopName(): string
    {
        return $this->getSettings()->shop_name;
    }

    /**
     * Get shop description.
     */
    public function getDescription(): string
    {
        return $this->getSettings()->description;
    }

    /**
     * Get QRIS image URL.
     */
    public function getQrisImageUrl(): ?string
    {
        return $this->getSettings()->getQrisImageUrl();
    }

    /**
     * Get QRIS account name.
     */
    public function getQrisAccountName(): ?string
    {
        return $this->getSettings()->qris_account_name;
    }
}
