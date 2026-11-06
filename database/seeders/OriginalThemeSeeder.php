<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ShopSetting;
use App\Models\ThemeSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class OriginalThemeSeeder extends Seeder
{
    /**
     * Run the database seeds for the Original PaiTech Theme & Catalog.
     */
    public function run(): void
    {
        // ── 1. Update Tema & Warna PaiTech Original (#0D9488 Teal & Dark Charcoal) ──
        ThemeSetting::updateOrCreate(
            ['id' => ThemeSetting::SINGLETON_ID],
            [
                // Base tokens
                'primary_color'             => '#0D9488',
                'secondary_color'           => '#333333',
                'accent_color'              => '#0D9488',
                'background_color'          => '#FFFFFF',
                'background_dark_color'     => '#1A1A1A',
                'text_color'                => '#262626',
                'text_light_color'          => '#6B7280',
                'success_color'             => '#10B981',
                'error_color'               => '#E63854',
                'warning_color'             => '#F59E0B',
                'info_color'                => '#0D9488',
                'border_radius'             => '0.75rem',
                'font_family'               => 'Inter',
                'dark_mode_enabled'         => true,

                // Header & Footer
                'header_bg_color'           => '#333333',
                'header_text_color'         => '#FFFFFF',
                'header_active_color'       => '#0D9488',
                'footer_bg_color'           => '#262626',
                'footer_text_color'         => '#9CA3AF',
                'footer_accent_color'       => '#0D9488',

                // Hero Banner
                'hero_bg_color'             => '#F1F1F1',
                'hero_text_color'           => '#262626',
                'hero_btn_color'            => '#0D9488',
                'hero_btn_text_color'       => '#FFFFFF',

                // Kartu Produk & Harga
                'card_product_bg_color'     => '#FFFFFF',
                'card_product_border_color' => '#E5E7EB',
                'card_product_text_color'   => '#262626',
                'card_product_price_color'  => '#E63854',
                'price_color'               => '#E63854',
                'card_product_btn_color'    => '#0D9488',

                // Kartu Artikel
                'card_article_bg_color'     => '#FFFFFF',
                'card_article_border_color' => '#E5E7EB',
                'card_article_tag_color'    => '#0D9488',
                'card_article_title_color'  => '#262626',
                'card_article_text_color'   => '#4B5563',

                // Halaman & Tombol Global
                'page_bg_color'             => '#FFFFFF',
                'page_text_color'           => '#262626',
                'primary_btn_color'         => '#0D9488',
                'primary_btn_text_color'    => '#FFFFFF',
            ]
        );

        Cache::forget(ThemeSetting::CACHE_KEY);

        // ── 2. Update Informasi Toko PaiTech (ShopSetting) ─────────────────
        $shop = ShopSetting::getSettings();
        $shop->shop_name = 'PaiTech';
        $shop->description = 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern.';
        $shop->address = 'Jl. Teknologi Raya No. 42, Jakarta Selatan 12345';
        $shop->whatsapp_number = '6287700558686';
        $shop->whatsapp_template = 'Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?';
        $shop->operating_hours = 'Senin - Sabtu: 08:00 - 17:00';
        $shop->hero_banner_text_1 = 'Solusi Teknologi Terbaik untuk Bisnis Anda';
        $shop->hero_banner_text_2 = 'Inovasi perangkat dan layanan berkualitas tinggi dari PaiTech untuk memajukan usaha Anda.';
        $shop->shipping_areas = ['Jabodetabek', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Seluruh Indonesia'];
        $shop->shipping_estimate_days = '1 - 3 Hari';
        $shop->save();

        Cache::forget(ShopSetting::CACHE_KEY);

        // ── 3. Seed Produk PaiTech ─────────────────────────────────────────
        $productsData = [
            [
                'name' => 'Ad Minim Veniam Quis',
                'slug' => 'ad-minim-veniam-quis',
                'description' => '<p>Ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>',
                'short_description' => 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur.',
                'price' => 1800000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'minim_veniam',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Nostrud Exercitation Ullamco',
                'slug' => 'nostrud-exercitation-ullamco',
                'description' => '<p>Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.</p>',
                'short_description' => 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.',
                'price' => 6500000,
                'stock_status' => 'preorder',
                'is_published' => true,
                'category' => 'nostrud',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Laboris Nisi Ut Aliquip',
                'slug' => 'laboris-nisi-ut-aliquip',
                'description' => '<p>Laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p><p>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore.</p>',
                'short_description' => 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
                'price' => 1200000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'laboris',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800', 'is_primary' => false],
                ]
            ],
        ];

        foreach ($productsData as $prod) {
            $images = $prod['images'];
            unset($prod['images']);

            $product = Product::updateOrCreate(
                ['slug' => $prod['slug']],
                $prod
            );

            if ($product->images()->count() === 0) {
                foreach ($images as $idx => $img) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'url'        => $img['url'],
                        'is_primary' => $img['is_primary'] ?? ($idx === 0),
                        'sort_order' => $idx,
                    ]);
                }
            }
        }

        // ── 4. Seed Artikel PaiTech ────────────────────────────────────────
        $articlesData = [
            [
                'title' => 'Lorem Ipsum Dolor Sit Amet Consectetur',
                'slug' => 'lorem-ipsum-dolor-sit-amet-consectetur',
                'content' => '<h2>Lorem Ipsum Dolor Sit Amet</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum:</p><ul><li>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</li><li>Accusantium doloremque laudantium totam rem aperiam eaque ipsa</li><li>Quae ab illo inventore veritatis et quasi architecto beatae vitae dicta</li><li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit</li></ul><p>Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>',
                'excerpt' => 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Adipiscing Elit Sed Do Eiusmod Tempor',
                'slug' => 'adipiscing-elit-sed-do-eiusmod-tempor',
                'content' => '<h2>Consectetur Adipiscing Elit</h2><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Indicators lorem ipsum dolor sit amet:</p><ul><li>Consectetur adipiscing elit sed do eiusmod tempor incididunt</li><li>Ut labore et dolore magna aliqua enim ad minim veniam</li><li>Quis nostrud exercitation ullamco laboris nisi ut aliquip</li><li>Ex ea commodo consequat duis aute irure dolor in reprehenderit</li></ul><p>In voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.</p>',
                'excerpt' => 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                'image' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
            [
                'title' => 'Incididunt Ut Labore Et Dolore Magna Aliqua',
                'slug' => 'incididunt-ut-labore-et-dolore-magna-aliqua',
                'content' => '<h2>Sed Do Eiusmod Tempor Incididunt</h2><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Best practices lorem ipsum dolor sit amet:</p><ul><li>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do</li><li>Eiusmod tempor incididunt ut labore et dolore magna aliqua enim</li><li>Ad minim veniam quis nostrud exercitation ullamco laboris nisi ut</li><li>Aliquip ex ea commodo consequat duis aute irure dolor in</li><li>Reprehenderit in voluptate velit esse cillum dolore eu fugiat</li></ul><p>Nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
                'excerpt' => 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
        ];

        foreach ($articlesData as $art) {
            Article::updateOrCreate(
                ['slug' => $art['slug']],
                $art
            );
        }

        $this->command?->info('Tema PaiTech (Original) berhasil diterapkan.');
    }
}
