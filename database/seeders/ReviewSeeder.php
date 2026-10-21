<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Review::count() > 0) {
            return;
        }

        $products = Product::all();

        $reviewsData = [
            [
                'product_index' => 0,
                'name' => 'Lorem Ipsum',
                'city' => 'Jakarta',
                'rating' => 5,
                'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Highly recommended!',
                'is_approved' => true,
            ],
            [
                'product_index' => 1,
                'name' => 'Dolor Sit',
                'city' => 'Bandung',
                'rating' => 5,
                'review' => 'Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
                'is_approved' => true,
            ],
            [
                'product_index' => 2,
                'name' => 'Amet Consectetur',
                'city' => 'Surabaya',
                'rating' => 5,
                'review' => 'Adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.',
                'is_approved' => true,
            ],
            [
                'product_index' => 3,
                'name' => 'Adipiscing Elit',
                'city' => 'Yogyakarta',
                'rating' => 5,
                'review' => 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
                'is_approved' => true,
            ],
            [
                'product_index' => 4,
                'name' => 'Sed Do Eiusmod',
                'city' => 'Tangerang',
                'rating' => 5,
                'review' => 'Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit.',
                'is_approved' => true,
            ],
            [
                'product_index' => 5,
                'name' => 'Tempor Incididunt',
                'city' => 'Jakarta',
                'rating' => 4,
                'review' => 'Ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
                'is_approved' => true,
            ],
            [
                'product_index' => 7,
                'name' => 'Ut Labore Et',
                'city' => 'Semarang',
                'rating' => 5,
                'review' => 'Dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
                'is_approved' => true,
            ],
        ];

        foreach ($reviewsData as $rev) {
            $product = $products->get($rev['product_index']);
            Review::create([
                'product_id' => $product ? $product->id : null,
                'name' => $rev['name'],
                'city' => $rev['city'],
                'rating' => $rev['rating'],
                'review' => $rev['review'],
                'is_approved' => $rev['is_approved'],
            ]);
        }
    }
}
