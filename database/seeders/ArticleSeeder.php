<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Article::count() > 0) {
            return;
        }

        $articlesData = [
            [
                'title' => 'Tren Teknologi 2026: AI Generatif dan Dampaknya pada Bisnis',
                'content' => '<h2>Revolusi AI Generatif di Dunia Bisnis</h2><p>Artificial Intelligence generatif seperti GPT-4, DALL-E, dan Midjourney telah mengubah landscape bisnis secara fundamental. Dari content creation hingga product design, AI kini menjadi co-pilot yang meningkatkan produktivitas tim hingga 10x lipat.</p><p>Artikel ini membahas bagaimana bisnis Indonesia bisa memanfaatkan AI untuk:</p><ul><li>Automasi customer service dengan chatbot cerdas yang memahami konteks</li><li>Personalisasi marketing campaign berdasarkan behavioral data</li><li>Optimasi supply chain dengan predictive analytics</li><li>Percepatan product development dengan AI-assisted design</li></ul><p>PaiTech menyediakan konsultasi dan implementasi AI custom untuk transformasi digital bisnis Anda.</p>',
                'excerpt' => 'Bagaimana AI Generatif mengubah cara bisnis beroperasi dan meningkatkan efisiensi hingga 10x lipat.',
                'image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Cloud Migration: Kapan Waktu yang Tepat untuk Bisnis Anda?',
                'content' => '<h2>Menentukan Timing Cloud Migration</h2><p>Cloud computing bukan lagi pilihan, melainkan kebutuhan untuk bisnis yang ingin scale dengan cepat. Namun, timing migration sangat krusial untuk meminimalkan downtime dan memaksimalkan ROI.</p><p>Indikator bisnis Anda siap migrasi ke cloud:</p><ul><li>Traffic website yang semakin meningkat dan unpredictable</li><li>Biaya maintenance server on-premise yang membengkak</li><li>Team yang bekerja secara remote dan butuh akses everywhere</li><li>Kebutuhan backup dan disaster recovery yang lebih robust</li></ul><p>AWS, Google Cloud, atau Azure? Kami bantu analisis kebutuhan dan implementasi sesuai budget Anda.</p>',
                'excerpt' => 'Panduan lengkap menentukan waktu yang tepat untuk migrasi infrastruktur ke cloud.',
                'image' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
            [
                'title' => 'Cybersecurity Essential: Proteksi Data di Era Digital',
                'content' => '<h2>Melindungi Aset Digital Bisnis</h2><p>Serangan cyber meningkat 300% di tahun 2025. Ransomware, phishing, dan data breach bukan lagi ancaman jauh, melainkan risiko nyata yang bisa menghancurkan bisnis dalam semalam.</p><p>Best practices cybersecurity yang wajib diimplementasikan:</p><ul><li>Multi-factor authentication (MFA) untuk semua akses sistem</li><li>Regular security audit dan penetration testing</li><li>Employee training tentang social engineering</li><li>Data encryption at rest dan in transit</li><li>Incident response plan yang ter-dokumentasi</li></ul><p>Investasi di cybersecurity bukan cost, melainkan insurance untuk continuity bisnis Anda.</p>',
                'excerpt' => 'Langkah-langkah esensial melindungi bisnis dari ancaman cyber di era digital.',
                'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Mobile-First Development: Mengapa Aplikasi Mobile Penting untuk Bisnis',
                'content' => '<h2>Era Mobile-First Business</h2><p>80% pengguna internet di Indonesia mengakses web melalui smartphone. Bisnis tanpa strategi mobile-first akan tertinggal jauh di kompetisi digital.</p><p>Keunggulan memiliki aplikasi mobile native:</p><ul><li>User engagement 3x lebih tinggi dibanding mobile web</li><li>Push notification untuk re-engagement yang efektif</li><li>Offline capability untuk akses tanpa internet</li><li>Better performance dan user experience</li><li>Akses ke native features: camera, GPS, sensors</li></ul><p>PaiTech spesialisasi dalam React Native dan Flutter development untuk hasil optimal dengan budget efisien.</p>',
                'excerpt' => 'Mengapa bisnis modern harus prioritaskan mobile app development untuk customer engagement.',
                'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
                'is_hero' => false,
                'is_published' => true,
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'UX Design yang Baik = Konversi yang Tinggi',
                'content' => '<h2>Investasi UX Design untuk ROI Maksimal</h2><p>User Experience bukan sekedar "make it pretty". UX yang baik adalah hasil dari user research, data analytics, dan iterative testing yang menghasilkan produk yang intuitive dan enjoyable to use.</p><p>Impact UX design yang baik pada bisnis:</p><ul><li>Conversion rate meningkat hingga 400%</li><li>Reduced customer support cost (self-service yang clear)</li><li>Brand loyalty yang lebih kuat</li><li>Lower bounce rate di website/app</li></ul><p>Kami menggunakan design thinking methodology untuk menciptakan pengalaman digital yang user-centered dan business-oriented.</p>',
                'excerpt' => 'Bagaimana investasi di UX design menghasilkan conversion rate yang jauh lebih tinggi.',
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
                'is_hero' => false,
                'is_published' => true,
                'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'DevOps Culture: Percepat Time-to-Market Produk Digital',
                'content' => '<h2>Transformasi dengan DevOps</h2><p>DevOps bukan sekedar tools, melainkan culture shift yang menggabungkan development dan operations untuk delivery yang lebih cepat dan reliable.</p><p>Manfaat implementasi DevOps:</p><ul><li>Deployment frequency meningkat hingga 200x</li><li>Lead time for changes berkurang dari minggu menjadi jam</li><li>Mean time to recovery (MTTR) lebih cepat</li><li>Change failure rate yang lebih rendah</li></ul><p>CI/CD pipeline, containerization dengan Docker/Kubernetes, dan monitoring automation adalah fondasi DevOps modern.</p>',
                'excerpt' => 'Mengimplementasikan DevOps culture untuk delivery produk yang lebih cepat dan reliable.',
                'image' => 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200',
                'is_hero' => false,
                'is_published' => true,
                'published_at' => now()->subDays(5),
            ],
        ];

        foreach ($articlesData as $art) {
            Article::create([
                'title' => $art['title'],
                'slug' => Str::slug($art['title']),
                'content' => $art['content'],
                'excerpt' => $art['excerpt'],
                'image' => $art['image'],
                'is_hero' => $art['is_hero'],
                'is_published' => $art['is_published'],
                'published_at' => $art['published_at'],
            ]);
        }
    }
}
