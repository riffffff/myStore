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
        if (ShopSetting::count() === 0) {
            ShopSetting::create([
                'shop_name' => 'PaiTech',
                'description' => 'Solusi teknologi terpadu untuk transformasi digital bisnis Anda. Kami menyediakan layanan web development, mobile app, cloud infrastructure, AI/ML integration, dan konsultasi IT profesional.',
                'address' => 'Gedung Cyber 2 Tower, Jl. HR Rasuna Said Blok X-5 Kav. 13, Jakarta Selatan 12950',
                'whatsapp_number' => '6281234567890',
                'whatsapp_template' => "Halo PaiTech, saya tertarik dengan layanan *{product_name}* seharga {product_price}. Bisakah kita diskusi lebih lanjut?",
                'operating_hours' => 'Senin - Jumat: 09.00 - 18.00 WIB',
                'hero_banner_text_1' => 'Transformasi Digital untuk Bisnis Modern',
                'hero_banner_text_2' => 'Solusi teknologi inovatif yang mengakselerasi pertumbuhan bisnis Anda',
                'shipping_areas' => ['Konsultasi Online', 'On-site Jakarta & Sekitarnya', 'Remote Implementation', 'Nationwide Support'],
                'shipping_estimate_days' => '2 - 12 Minggu (tergantung scope project)',
            ]);
        }
    }
}
