<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ProductionReviewSeeder extends Seeder
{
    /**
     * Seed realistic customer reviews for production.
     */
    public function run(): void
    {
        $products = Product::where('is_published', true)->get();

        if ($products->isEmpty()) {
            $products = Product::all();
        }

        if ($products->isEmpty()) {
            $this->command?->warn('Tidak ada produk di database. Lewati ProductionReviewSeeder.');
            return;
        }

        $reviewsData = [
            [
                'name'   => 'Nadia Putri',
                'city'   => 'Jakarta Selatan',
                'rating' => 5,
                'review' => 'Teksturnya lembut banget dan aroma butternya terasa premium. Kemasan juga rapi dan aman sampai rumah. Pasti pesan lagi untuk acara keluarga!',
            ],
            [
                'name'   => 'Rizky Pratama',
                'city'   => 'Bandung',
                'rating' => 5,
                'review' => 'Pengiriman cepat dan admin sangat responsif. Rasanya pas, tidak terlalu manis, cocok dinikmati bareng kopi pagi.',
            ],
            [
                'name'   => 'Siti Rahmawati',
                'city'   => 'Surabaya',
                'rating' => 5,
                'review' => 'Sudah beberapa kali order di sini dan kualitasnya selalu konsisten. Cocok juga dijadikan hampers untuk kerabat.',
            ],
            [
                'name'   => 'Dimas Wijaya',
                'city'   => 'Yogyakarta',
                'rating' => 4,
                'review' => 'Kualitas bahan terasa sekali, porsinya pas dan tampilannya cantik. Recommended untuk yang cari produk fresh.',
            ],
            [
                'name'   => 'Aulia Maharani',
                'city'   => 'Tangerang',
                'rating' => 5,
                'review' => 'Suka sekali sama teksturnya yang fresh dan lembut. Keluarga di rumah langsung habis dalam sekali duduk!',
            ],
            [
                'name'   => 'Fajar Nugroho',
                'city'   => 'Bekasi',
                'rating' => 5,
                'review' => 'Pelayanan ramah, proses pemesanan mudah lewat web, dan pesanan tiba tepat waktu dalam kondisi sempurna.',
            ],
            [
                'name'   => 'Dewi Kartika',
                'city'   => 'Semarang',
                'rating' => 5,
                'review' => 'Harga sebanding dengan kualitasnya. Packaging sangat aman dan higienis, terima kasih!',
            ],
            [
                'name'   => 'Hendra Kusuma',
                'city'   => 'Depok',
                'rating' => 4,
                'review' => 'Produk sesuai deskripsi dan foto. Rasa enak dan tidak bikin enek, bakal jadi langganan.',
            ],
        ];

        foreach ($reviewsData as $index => $item) {
            $product = $products->get($index % $products->count());

            Review::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'name'       => $item['name'],
                ],
                [
                    'city'        => $item['city'],
                    'rating'      => $item['rating'],
                    'review'      => $item['review'],
                    'is_approved' => true,
                ]
            );
        }
    }
}
