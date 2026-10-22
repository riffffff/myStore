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
