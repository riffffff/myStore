<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ShopSetting;
use App\Models\ThemeSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class BakeryInvertedThemeSeeder extends Seeder
{
    /**
     * Run the database seeds for Bakery / Pastry Store (Inverted Theme: Butter Morning).
     * Membalik palet warna: Butter Yellow (#F5E8AA & #E5BE54) menjadi dominan/background,
     * Lavender/Plum (#6E4F78 & #3B2B42) menjadi aksen & tombol.
     * Warna harga tetap merah e-commerce standar (#E63854) demi standar UI/UX yang baik.
     */
    public function run(): void
    {
        // ── 1. Update Tema & Warna Toko Kue (Inverted: Kuning Dominan, Ungu Aksen) ──
        $theme = ThemeSetting::updateOrCreate(
            ['id' => ThemeSetting::SINGLETON_ID],
            [
                // Base colors
                'primary_color'              => '#E5BE54', // Butter Yellow keemasan hangat
                'secondary_color'            => '#6E4F78', // Lavender ungu sebagai aksen kontras
                'accent_color'               => '#6E4F78', // Ungu lavender untuk aksen
                'background_color'           => '#FCF6E5', // Warm Butter Cream lembut
                'background_dark_color'      => '#2A2418',
                'text_color'                 => '#2A1F30', // Plum gelap elegan untuk teks
                'text_light_color'           => '#6B5A72',
                'success_color'              => '#3E8E6A',
                'error_color'                => '#B4365E',
                'warning_color'              => '#C98A1B',
                'info_color'                 => '#6E4F78',
                'border_radius'              => '1rem',    // Sudut membulat ramah khas kue
                'font_family'                => 'poppins', // Font Poppins (ramah, modern, membulat)
                'dark_mode_enabled'          => true,

                // Header & Footer
                'header_bg_color'            => '#F5E8AA', // Header Butter Yellow
                'header_text_color'          => '#2A1F30', // Teks header gelap kontras tajam
                'header_active_color'        => '#6E4F78', // Menu aktif Lavender Ungu
                'footer_bg_color'            => '#3B2B42', // Footer plum pekat elegan
                'footer_text_color'          => '#FAF3E0',
                'footer_accent_color'        => '#F5E8AA', // Aksen link Butter Yellow

                // Hero Banner
                'hero_bg_color'              => '#F5E8AA', // Butter Yellow cerah hangat
                'hero_text_color'            => '#2A1F30', // Teks plum gelap tajam
                'hero_btn_color'             => '#6E4F78', // Tombol CTA Lavender Ungu
                'hero_btn_text_color'        => '#FFFFFF', // Teks tombol putih bersih kontras

                // Kartu Produk
                'card_product_bg_color'      => '#FFFFFF',
                'card_product_border_color'  => '#F3E7C4', // Border tipis butter cream
                'card_product_text_color'    => '#2A1F30',
                'card_product_price_color'   => '#E63854', // Standar harga e-commerce (merah #E63854)
                'price_color'                => '#E63854', // Standar harga e-commerce (merah #E63854)
                'card_product_btn_color'     => '#6E4F78', // Tombol beli lavender ungu

                // Kartu Artikel
                'card_article_bg_color'      => '#FFFFFF',
                'card_article_border_color'  => '#F3E7C4',
                'card_article_tag_color'     => '#6E4F78',
                'card_article_title_color'   => '#2A1F30',
                'card_article_text_color'    => '#5C4E63',

                // Halaman & Tombol Global
                'page_bg_color'              => '#FCF6E5', // Warm Butter Cream
                'page_text_color'            => '#2A1F30',
                'primary_btn_color'          => '#6E4F78', // Tombol utama ungu lavender
                'primary_btn_text_color'     => '#FFFFFF',
            ]
        );

        Cache::forget(ThemeSetting::CACHE_KEY);

        // ── 2. Update Teks & Informasi Toko Kue (ShopSetting) ─────────────────
        $shop = ShopSetting::getSettings();
        $shop->shop_name = 'Golden Butter Pastry & Bakery';
        $shop->description = 'Toko kue dan roti artisan dengan racikan butter keemasan pilihan, dipanggang hangat setiap pagi.';
        $shop->hero_banner_text_1 = 'Golden Butter Pastry & Bakery Segar Setiap Pagi';
        $shop->hero_banner_text_2 = 'Cita rasa renyah, wangi butter murni, dan kelembutan yang memanjakan lidah Anda.';
        $shop->whatsapp_template = 'Halo Golden Butter Bakery, saya tertarik memesan *{product_name}* seharga {product_price}. Apakah stok masih tersedia?';
        $shop->operating_hours = 'Setiap Hari: 06:30 - 21:30 WIB';
        $shop->address = 'Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan';
        $shop->shipping_areas = ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Seluruh Jabodetabek (Same-Day)'];
        $shop->shipping_estimate_days = 'Same-Day Delivery (1 Hari)';
        $shop->save();

        Cache::forget(ShopSetting::CACHE_KEY);

        // ── 3. Seed Produk Toko Kue ──────────────────────────────────────────
        $bakeryProducts = [
            [
                'name'              => 'Golden French Butter Croissant',
                'slug'              => 'golden-french-butter-croissant',
                'price'             => 26000,
                'original_price'    => 30000,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Croissant emas renyah berlapis dengan wangi French butter 100% murni.',
                'description'       => 'Croissant khas Perancis berlapis-lapis renyah dengan keharuman French butter 100% murni. Golden brown dan lumer di mulut.',
                'image_url'         => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Butter Morning Sourdough Loaf',
                'slug'              => 'butter-morning-sourdough-loaf',
                'price'             => 45000,
                'original_price'    => 50000,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Roti fermentasi artisan beraroma gandum panggang alami dan renyah.',
                'description'       => 'Roti fermentasi alami dengan kulit garing dan renyah serta bagian dalam yang kenyal lembut. Bebas bahan pengawet.',
                'image_url'         => 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Almond Frangipane Brioche',
                'slug'              => 'almond-frangipane-brioche',
                'price'             => 34000,
                'original_price'    => null,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Roti brioche mentega lembut dipanggang dengan krim almond dan kacang almond iris.',
                'description'       => 'Roti brioche kaya telur dan mentega yang dipanggang dengan sirup bunga jeruk, krim almond frangipane, dan taburan kacang almond renyah.',
                'image_url'         => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Pain au Chocolat Pure Butter',
                'slug'              => 'pain-au-chocolat-pure-butter',
                'price'             => 29000,
                'original_price'    => null,
                'stock_status'      => 'available',
                'category'          => 'lainnya',
                'short_description' => 'Pastry mentega renyah dengan lelehan dua stik cokelat hitam Belgia.',
                'description'       => 'Pastry lapis mentega dengan dua batang cokelat dark Belgia meleleh di dalamnya. Sangat nikmat dinikmati selagi hangat bersama kopi.',
                'image_url'         => 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Vanilla Custard Strawberry Tart',
                'slug'              => 'vanilla-custard-strawberry-tart',
                'price'             => 58000,
                'original_price'    => 68000,
                'stock_status'      => 'available',
                'category'          => 'aksesoris',
                'short_description' => 'Tart mentega renyah dengan krim custard vanila madu dan stroberi segar.',
                'description'       => 'Ribuan lapis pastry renyah berpadu dengan custard cream vanila madu lembut dan potongan buah stroberi segar pegunungan.',
                'image_url'         => 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
                'is_published'      => true,
            ],
            [
                'name'              => 'Lavender Honey Cake',
                'slug'              => 'lavender-honey-cake',
                'price'             => 175000,
                'original_price'    => 195000,
                'stock_status'      => 'available',
                'category'          => 'aksesoris',
                'short_description' => 'Kue tart lembut dengan infusi madu murni dan aroma lavender yang menenangkan.',
                'description'       => 'Tart kue lembut dengan infusi aroma bunga lavender alami, krim keju vanila madu, dan hiasan edible flower yang memukau.',
                'image_url'         => 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800',
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

        // ── 4. Seed Artikel Toko Roti ─────────────────────────────────────────
        $bakeryArticles = [
            [
                'title'        => 'Kelezatan Butter Fermentasi dalam Pembuatan Roti Artisan',
                'slug'         => 'kelezatan-butter-fermentasi-dalam-pembuatan-roti-artisan',
                'excerpt'      => 'Mengapa cultured butter memberikan aroma dan gurih alami yang jauh lebih kaya.',
                'content'      => '<p>Mentega fermentasi (cultured butter) menghasilkan kedalaman rasa yang unik pada adonan kue dan roti. Di Golden Butter Bakery, kami menggunakan teknik laminasi suhu terkontrol agar lapisannya menghasilkan kerenyahan maksimal.</p>',
                'image'        => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
                'is_published' => true,
                'is_hero'      => true,
            ],
            [
                'title'        => 'Tips Menikmati Roti Hangat di Pagi Hari Bersama Kopi',
                'slug'         => 'tips-menikmati-roti-hangat-di-pagi-hari-bersama-kopi',
                'excerpt'      => 'Cara terbaik menghangatkan kembali croissant dan sourdough dalam hitungan menit.',
                'content'      => '<p>Panaskan oven atau air fryer ke suhu 180°C selama 3-4 menit sebelum memasukkan croissant. Tekstur luar akan kembali garing sempurna seperti baru keluar dari pemanggang.</p>',
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

        $this->command?->info('✅ Tema Bakery Inverted (Butter Morning: Kuning Dominan, Ungu Aksen) berhasil diterapkan!');
    }
}
