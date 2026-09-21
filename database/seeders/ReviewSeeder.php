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
                'name' => 'Budi Hartono',
                'city' => 'Jakarta',
                'rating' => 5,
                'review' => 'Tim PaiTech sangat profesional dalam menghandle project website perusahaan kami. Dari discovery phase sampai deployment sangat terstruktur. Website jadinya cepat, modern, dan SEO-friendly. Highly recommended!',
                'is_approved' => true,
            ],
            [
                'product_index' => 1,
                'name' => 'Siti Rahma',
                'city' => 'Bandung',
                'rating' => 5,
                'review' => 'Mobile app yang dikembangkan PaiTech untuk startup kami exceed expectations. Performance-nya smooth, UI/UX-nya intuitif, dan support after launch sangat responsive. Worth every rupiah!',
                'is_approved' => true,
            ],
            [
                'product_index' => 2,
                'name' => 'Andi Wijaya',
                'city' => 'Surabaya',
                'rating' => 5,
                'review' => 'Cloud migration dari on-premise ke AWS berjalan lancar tanpa downtime significant. Team PaiTech handle semua complexity dengan baik. Sekarang infrastructure kami jauh lebih scalable dan cost-efficient.',
                'is_approved' => true,
            ],
            [
                'product_index' => 3,
                'name' => 'Dewi Kusuma',
                'city' => 'Yogyakarta',
                'rating' => 5,
                'review' => 'AI chatbot yang diimplementasikan PaiTech berhasil reduce customer service workload kami hingga 60%. Model training-nya accurate dan integration dengan existing system seamless. Game changer untuk customer experience kami!',
                'is_approved' => true,
            ],
            [
                'product_index' => 4,
                'name' => 'Rudi Santoso',
                'city' => 'Tangerang',
                'rating' => 5,
                'review' => 'Digital marketing campaign dari PaiTech benar-benar data-driven. Conversion rate kami naik 250% dalam 3 bulan pertama. Tim mereka expert di Google Ads dan SEO. ROI sangat impressive!',
                'is_approved' => true,
            ],
            [
                'product_index' => 5,
                'name' => 'Linda Permata',
                'city' => 'Jakarta',
                'rating' => 4,
                'review' => 'Cybersecurity audit yang sangat comprehensive. PaiTech identified several critical vulnerabilities yang tidak kami sadari. Remediation plan-nya clear dan actionable. Sekarang kami tidur lebih nyenyak knowing our data is secure.',
                'is_approved' => true,
            ],
            [
                'product_index' => 7,
                'name' => 'Fajar Nugroho',
                'city' => 'Semarang',
                'rating' => 5,
                'review' => 'UI/UX redesign dari PaiTech transform aplikasi kami completely. User engagement naik drastis, bounce rate turun significantly. Design thinking approach mereka really understand user needs.',
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
