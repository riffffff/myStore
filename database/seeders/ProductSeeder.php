<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Product::count('*') > 0) {
            return;
        }

        $productsData = [
            [
                'name' => 'Lorem Ipsum Dolor Sit',
                'description' => '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
                'short_description' => 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'price' => 1500000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'lorem_ipsum',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Consectetur Adipiscing Elit',
                'description' => '<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>',
                'short_description' => 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
                'price' => 3500000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'consectetur',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Sed Do Eiusmod Tempor',
                'description' => '<p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
                'short_description' => 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
                'price' => 2500000,
                'stock_status' => 'preorder',
                'is_published' => true,
                'category' => 'eiusmod',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Ut Labore Et Dolore',
                'description' => '<p>Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p><p>In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
                'short_description' => 'In voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.',
                'price' => 4500000,
                'stock_status' => 'preorder',
                'is_published' => true,
                'category' => 'labore',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Magna Aliqua Ut Enim',
                'description' => '<p>Magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.</p><p>Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus.</p>',
                'short_description' => 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.',
                'price' => 850000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'magna_aliqua',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Ad Minim Veniam Quis',
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
            $product = Product::create([
                'name' => $prod['name'],
                'slug' => Str::slug($prod['name']),
                'category' => $prod['category'] ?? 'lainnya',
                'description' => $prod['description'],
                'short_description' => $prod['short_description'],
                'price' => $prod['price'],
                'stock_status' => $prod['stock_status'],
                'is_published' => $prod['is_published'] ?? true,
            ]);

            foreach ($prod['images'] as $idx => $img) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $img['url'],
                    'is_primary' => $img['is_primary'] ?? ($idx === 0),
                    'sort_order' => $idx,
                ]);
            }
        }
    }
}
