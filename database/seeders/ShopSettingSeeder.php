<?php

namespace Database\Seeders;

use App\Models\ShopSetting;
use Illuminate\Database\Seeder;

class ShopSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (ShopSetting::count('*') === 0) {
            ShopSetting::create([
                'shop_name' => 'PaiTech',
                'description' => 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.',
                'address' => 'Jl. Teknologi Raya No. 42, Jakarta Selatan 12345',
                'whatsapp_number' => '6281234567890',
                'whatsapp_template' => 'Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?',
                'operating_hours' => 'Senin - Sabtu: 08:00 - 17:00',
                'hero_banner_text_1' => 'Solusi Teknologi Terbaik untuk Bisnis Anda',
                'hero_banner_text_2' => 'Inovasi perangkat dan layanan berkualitas tinggi dari PaiTech untuk memajukan usaha Anda.',
                'shipping_areas' => ['Jabodetabek', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Seluruh Indonesia'],
                'shipping_estimate_days' => '1 - 3 Hari',
                'theme_primary_color' => '#3B82F6',
                'theme_secondary_color' => '#8B5CF6',
                'theme_accent_color' => '#F59E0B',
                'theme_background_color' => '#FFFFFF',
                'theme_background_dark_color' => '#111827',
                'theme_text_color' => '#1F2937',
                'theme_text_light_color' => '#6B7280',
                'theme_success_color' => '#10B981',
                'theme_error_color' => '#EF4444',
                'theme_warning_color' => '#F59E0B',
                'theme_info_color' => '#3B82F6',
                'theme_border_radius' => '0.5rem',
                'theme_font_family' => 'inter',
                'theme_dark_mode_enabled' => true,
            ]);
        }
    }
}
