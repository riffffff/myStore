<?php

namespace Database\Seeders;

use App\Models\ShopSetting;
use App\Models\ThemeSetting;
use Illuminate\Database\Seeder;

class ShopSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Shop Settings
        if (ShopSetting::count('*') === 0) {
            ShopSetting::create([
                'shop_name' => 'PaiTech',
                'description' => 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.',
                'address' => 'Jl. Teknologi Raya No. 42, Jakarta Selatan 12345',
                'whatsapp_number' => '6287700558686',
                'whatsapp_template' => 'Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?',
                'operating_hours' => 'Senin - Sabtu: 08:00 - 17:00',
                'hero_banner_text_1' => 'Solusi Teknologi Terbaik untuk Bisnis Anda',
                'hero_banner_text_2' => 'Inovasi perangkat dan layanan berkualitas tinggi dari PaiTech untuk memajukan usaha Anda.',
                'shipping_areas' => ['Jabodetabek', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Seluruh Indonesia'],
                'shipping_estimate_days' => '1 - 3 Hari',
            ]);
        }

        // 2. Theme Settings
        if (ThemeSetting::count('*') === 0) {
            ThemeSetting::create([
                'primary_color' => '#0D9488',
                'secondary_color' => '#333333',
                'accent_color' => '#0D9488',
                'background_color' => '#FFFFFF',
                'background_dark_color' => '#1A1A1A',
                'text_color' => '#262626',
                'text_light_color' => '#6B7280',
                'success_color' => '#10B981',
                'error_color' => '#E63854',
                'warning_color' => '#F59E0B',
                'info_color' => '#0D9488',
                'border_radius' => '0.75rem',
                'font_family' => 'Inter',
                'dark_mode_enabled' => true,
            ]);
        }
    }
}
