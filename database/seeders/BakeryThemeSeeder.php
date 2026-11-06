<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ShopSetting;
use App\Models\ThemeSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class BakeryThemeSeeder extends Seeder
{
    /**
     * Run the database seeds for Bakery / Pastry Store.
     * Mengisi tema warna (Soft Lavender #A985B1 & Butter Yellow #F5E8AA),
     * informasi teks toko kue, serta katalog produk kue & artikel.
     * Warna harga tetap merah e-commerce standar (#E63854) demi standar UI/UX yang baik.
     */
    public function run(): void
    {
        // ── 1. Update Tema & Warna Toko Kue (Opsi B: Lavender Dusk) ──────────
        $theme = ThemeSetting::updateOrCreate(
            ['id' => ThemeSetting::SINGLETON_ID],
            [
                // Base colors
                'primary_color'              => '#6E4F78', // Lavender pekat untuk tombol & teks tajam
                'secondary_color'            => '#2A1F30', // Plum gelap elegan untuk teks utama
                'accent_color'               => '#F5E8AA', // Butter Yellow
                'background_color'           => '#FCF6E5', // Latar hangat Warm Butter Cream (krem)
                'background_dark_color'      => '#241A29',
                'text_color'                 => '#2A1F30',
                'text_light_color'           => '#6B5A72',
                'success_color'              => '#3E8E6A',
                'error_color'                => '#B4365E',
                'warning_color'              => '#C98A1B',
                'info_color'                 => '#6E4F78',
                'border_radius'              => '1rem',    // Sudut membulat ramah khas kue
                'font_family'                => 'poppins', // Font Poppins (ramah, modern, membulat)
                'dark_mode_enabled'          => true,

                // Header & Footer
                'header_bg_color'            => '#6E4F78', // Header lavender berkelas
                'header_text_color'          => '#FFFFFF', // Teks menu putih bersih
                'header_active_color'        => '#F5E8AA', // Menu aktif Butter Yellow
                'footer_bg_color'            => '#3B2B42', // Footer plum pekat
                'footer_text_color'          => '#EDE4F0',
                'footer_accent_color'        => '#F5E8AA', // Aksen link Butter Yellow

                // Hero Banner
                'hero_bg_color'              => '#F5E8AA', // Hero Banner Butter Yellow
                'hero_text_color'            => '#2A1F30', // Judul & teks gelap tajam di atas kuning
                'hero_btn_color'             => '#6E4F78', // Tombol CTA Lavender
                'hero_btn_text_color'        => '#FFFFFF', // Teks tombol putih bersih kontras

                // Kartu Produk
                'card_product_bg_color'      => '#FFFDF7', // Krim putih hangat
                'card_product_border_color'  => '#EBD9AC', // Border emas butter hangat
                'card_product_text_color'    => '#2A1F30',
                'card_product_price_color'   => '#E63854', // Standar harga e-commerce (merah #E63854)
                'price_color'                => '#E63854', // Standar harga e-commerce (merah #E63854)
                'card_product_btn_color'     => '#6E4F78',

                // Kartu Artikel
                'card_article_bg_color'      => '#FFFDF7',
                'card_article_border_color'  => '#EBD9AC',
                'card_article_tag_color'     => '#6E4F78',
                'card_article_title_color'   => '#2A1F30',
                'card_article_text_color'    => '#5C4E63',

                // Halaman & Tombol Global
                'page_bg_color'              => '#FCF6E5', // Latar belakang seluruh halaman Warm Butter Cream (krem)
                'page_text_color'            => '#2A1F30',
                'primary_btn_color'          => '#6E4F78',
                'primary_btn_text_color'     => '#FFFFFF',
            ]
        );

        Cache::forget(ThemeSetting::CACHE_KEY);

        // ── 2. Update Teks & Informasi Toko Kue (ShopSetting) ─────────────────
        $shop = ShopSetting::getSettings();
        $shop->shop_name = 'Sweet Lavender Bakery & Patisserie';
        $shop->description = 'Toko kue dan artisan pastry premium dengan bahan butter pilihan, dipanggang segar setiap hari.';
        $shop->hero_banner_text_1 = 'Artisan Pastry & Kue Tart Pilihan Terbaik';
        $shop->hero_banner_text_2 = 'Dibuat dengan butter premium dan cinta, siap menemani momen manis keluarga Anda.';
        $shop->whatsapp_template = 'Halo Sweet Lavender Bakery, saya tertarik memesan kue *{product_name}* seharga {product_price}. Apakah masih tersedia hari ini?';
        $shop->operating_hours = 'Setiap Hari: 07:00 - 21:00 WIB';
        $shop->address = 'Jl. Melati Wangi No. 18, Kebayoran Baru, Jakarta Selatan';
        $shop->shipping_areas = ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Seluruh Jabodetabek (Same-Day)'];
        $shop->shipping_estimate_days = 'Same-Day Delivery (1 Hari)';
        $shop->save();

        Cache::forget(ShopSetting::CACHE_KEY);

        // ── 3. Seed Produk Kue Lezat (Katalog Toko Kue) ──────────────────────
        $bakeryProducts = [
            [
                'name'              => 'Croissant Butter Flaky',
                'slug'              => 'croissant-butter-flaky',
                'price'             => 25000,
                'original_price'    => 28000,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Croissant Perancis berlapis-lapis renyah dengan keharuman French butter 100% murni.',
                'description'       => 'Croissant khas Perancis berlapis-lapis renyah dengan keharuman French butter 100% murni. Golden brown dan lumer di mulut.',
                'image_url'         => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Lavender Velvet Tart',
                'slug'              => 'lavender-velvet-tart',
                'price'             => 185000,
                'original_price'    => 210000,
                'stock_status'      => 'available',
                'category'          => 'aksesoris',
                'short_description' => 'Tart kue lembut dengan infusi aroma bunga lavender alami dan krim keju vanila madu.',
                'description'       => 'Tart kue lembut dengan infusi aroma bunga lavender alami, krim keju vanila madu, dan hiasan edible flower yang memukau.',
                'image_url'         => 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Pain au Chocolat Belgia',
                'slug'              => 'pain-au-chocolat-belgia',
                'price'             => 28000,
                'original_price'    => null,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Pastry lapis mentega dengan dua batang cokelat dark Belgia meleleh di dalamnya.',
                'description'       => 'Pastry lapis mentega dengan dua batang cokelat dark Belgia meleleh di dalamnya. Sangat nikmat dinikmati selagi hangat bersama kopi.',
                'image_url'         => 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Butter Morning Sourdough',
                'slug'              => 'butter-morning-sourdough',
                'price'             => 42000,
                'original_price'    => 48000,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Roti fermentasi alami dengan kulit garing dan bagian dalam yang kenyal lembut.',
                'description'       => 'Roti fermentasi alami dengan kulit garing dan renyah serta bagian dalam yang kenyal lembut. Bebas bahan pengawet.',
                'image_url'         => 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Strawberry Mille-Feuille',
                'slug'              => 'strawberry-mille-feuille',
                'price'             => 55000,
                'original_price'    => 65000,
                'stock_status'      => 'available',
                'category'          => 'aksesoris',
                'short_description' => 'Ribuan lapis pastry renyah berpadu dengan custard cream vanila dan buah stroberi segar.',
                'description'       => 'Ribuan lapis pastry renyah berpadu dengan custard cream vanila madu lembut dan potongan buah stroberi segar pegunungan.',
                'image_url'         => 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Almond Bostock Brioche',
                'slug'              => 'almond-bostock-brioche',
                'price'             => 32000,
                'original_price'    => null,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Roti brioche mentega dipanggang dengan krim almond frangipane dan kacang almond.',
                'description'       => 'Roti brioche kaya telur dan mentega yang dipanggang dengan sirup bunga jeruk, krim almond frangipane, dan taburan kacang almond renyah.',
                'image_url'         => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
        ];

        foreach ($bakeryProducts as $item) {
            $imgUrl = $item['image_url'];
            unset($item['image_url']);

            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                $item
            );

            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url'        => $imgUrl,
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }
        }

        // ── 4. Seed Artikel Edukasi Toko Kue ─────────────────────────────────
        $bakeryArticles = [
            [
                'title'        => 'Rahasia Kelezatan Butter Premium pada Tekstur Pastry',
                'slug'         => 'rahasia-kelezatan-butter-premium-pada-tekstur-pastry',
                'excerpt'      => 'Ketahui mengapa jenis mentega sangat menentukan keharuman dan kerenyahan kue panggang.',
                'content'      => '<p>Bagi penikmat artisan pastry, aroma harum mentega saat pintu toko dibuka adalah surga tersendiri. Kunci kerenyahan setiap lembar adonan laminasi terletak pada titik leleh lemak mentega murni (82% butterfat).</p><p>Di Sweet Lavender Bakery, kami selalu memilih mentega fermentasi tradisional (cultured butter) yang memberikan rasa gurih alami dan aftertaste yang kaya tanpa rasa eneg di tenggorokan.</p>',
                'image'        => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
                'is_published' => true,
                'is_hero'      => true,
            ],
            [
                'title'        => 'Cara Menyimpan Roti Sourdough agar Tetap Renyah 3 Hari',
                'slug'         => 'cara-menyimpan-roti-sourdough-agar-tetap-renyah',
                'excerpt'      => 'Panduan praktis menjaga tekstur roti gandum sourdough tetap kenyal di dalam dan renyah di luar.',
                'content'      => '<p>Hindari menyimpan roti sourdough di dalam kulkas karena suhu dingin kulkas justru mempercepat kristalisasi pati (staling). Simpan roti dalam kantong kertas pada suhu ruang untuk mempertahankan kerenyahannya.</p>',
                'image'        => 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=1200',
                'is_published' => true,
                'is_hero'      => false,
            ],
        ];

        foreach ($bakeryArticles as $art) {
            Article::updateOrCreate(
                ['slug' => $art['slug']],
                $art
            );
        }

        $this->command?->info('✅ Seluruh data toko kue (Tema, Teks Toko, Produk Kue, & Artikel) berhasil diterapkan!');
    }
}
