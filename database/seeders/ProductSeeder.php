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
        if (Product::count() > 0) {
            return;
        }

        $productsData = [
            [
                'name' => 'Website Development Professional',
                'description' => '<p>Layanan pembuatan website profesional untuk bisnis Anda. Kami menggunakan teknologi terkini seperti Laravel, React, dan Vue.js untuk membangun website yang cepat, aman, dan SEO-friendly.</p><p>Termasuk: Desain UI/UX modern, Responsive mobile-first, Admin panel lengkap, Integrasi payment gateway, SSL certificate, dan maintenance 3 bulan gratis. Cocok untuk company profile, e-commerce, dan web aplikasi.</p>',
                'short_description' => 'Website profesional dengan teknologi modern, responsive, dan SEO-optimized.',
                'price' => 15000000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'web_development',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Mobile App Development (iOS & Android)',
                'description' => '<p>Kembangkan aplikasi mobile native untuk iOS dan Android dengan performa optimal. Menggunakan React Native atau Flutter untuk development yang efisien dengan hasil berkualitas tinggi.</p><p>Fitur lengkap: Push notification, Real-time sync, Offline mode, Analytics integration, App store optimization, dan support teknis 6 bulan. Cocok untuk startup, retail, dan layanan on-demand.</p>',
                'short_description' => 'Aplikasi mobile native iOS & Android dengan fitur lengkap dan performa optimal.',
                'price' => 35000000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'mobile_development',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Cloud Infrastructure Setup',
                'description' => '<p>Migrasi dan setup infrastruktur cloud untuk bisnis modern. Kami mengelola deployment di AWS, Google Cloud, atau Azure dengan best practices DevOps dan container orchestration.</p><p>Termasuk: Auto-scaling setup, Load balancer configuration, Database clustering, Backup automation, Monitoring & alerting system, dan CI/CD pipeline. Tingkatkan reliability dan scalability aplikasi Anda.</p>',
                'short_description' => 'Setup infrastruktur cloud AWS/GCP/Azure dengan DevOps best practices.',
                'price' => 25000000,
                'stock_status' => 'preorder',
                'is_published' => true,
                'category' => 'cloud_services',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'AI & Machine Learning Integration',
                'description' => '<p>Integrasikan kecerdasan buatan ke dalam bisnis Anda. Kami menyediakan solusi AI custom untuk chatbot, recommendation system, predictive analytics, dan computer vision.</p><p>Teknologi: TensorFlow, PyTorch, OpenAI API, Natural Language Processing, dan Deep Learning. Termasuk model training, deployment, API integration, dan dokumentasi lengkap. Transformasi data menjadi insight yang actionable.</p>',
                'short_description' => 'Solusi AI & Machine Learning custom untuk automasi dan insight bisnis.',
                'price' => 45000000,
                'stock_status' => 'preorder',
                'is_published' => true,
                'category' => 'ai_ml',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Digital Marketing & SEO Package',
                'description' => '<p>Paket digital marketing komprehensif untuk meningkatkan visibility dan konversi bisnis online Anda. Campaign management di Google Ads, Facebook Ads, Instagram, dan LinkedIn.</p><p>Termasuk: SEO optimization, Content marketing, Social media management, Email marketing automation, Analytics & reporting dashboard, dan conversion rate optimization. Tim expert siap membantu growth bisnis Anda secara terukur.</p>',
                'short_description' => 'Paket digital marketing lengkap: SEO, Ads, Social Media, dan Analytics.',
                'price' => 8500000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'digital_marketing',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'Cybersecurity Audit & Protection',
                'description' => '<p>Audit keamanan menyeluruh untuk infrastruktur IT Anda. Identifikasi vulnerabilities, compliance check, dan implementasi security best practices untuk melindungi data bisnis.</p><p>Layanan: Penetration testing, Security code review, GDPR compliance, ISO 27001 consultation, Firewall & IDS setup, Security training untuk team, dan incident response plan. Lindungi aset digital bisnis Anda dari cyber threats.</p>',
                'short_description' => 'Audit keamanan cyber dan implementasi proteksi infrastruktur IT.',
                'price' => 18000000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'cybersecurity',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'ERP System Implementation',
                'description' => '<p>Implementasi sistem ERP (Enterprise Resource Planning) untuk mengintegrasikan semua proses bisnis Anda. Mulai dari inventory, accounting, HR, hingga CRM dalam satu platform terpadu.</p><p>Menggunakan Odoo atau custom development sesuai kebutuhan. Termasuk: Business process analysis, System configuration, Data migration, User training, Go-live support, dan maintenance. Tingkatkan efisiensi operasional hingga 40%.</p>',
                'short_description' => 'Implementasi sistem ERP untuk integrasi proses bisnis end-to-end.',
                'price' => 65000000,
                'stock_status' => 'preorder',
                'is_published' => true,
                'category' => 'erp_system',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', 'is_primary' => false],
                ]
            ],
            [
                'name' => 'UI/UX Design Consultation',
                'description' => '<p>Konsultasi dan desain UI/UX profesional untuk aplikasi atau website Anda. Kami menggunakan design thinking methodology untuk menciptakan user experience yang optimal.</p><p>Deliverables: User research & persona, Wireframes, High-fidelity mockups, Interactive prototype, Design system documentation, dan usability testing. Tools: Figma, Adobe XD, Sketch. Desain yang tidak hanya cantik, tapi juga meningkatkan konversi.</p>',
                'short_description' => 'Konsultasi UI/UX design dengan metodologi design thinking.',
                'price' => 12000000,
                'stock_status' => 'available',
                'is_published' => true,
                'category' => 'uiux_design',
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
