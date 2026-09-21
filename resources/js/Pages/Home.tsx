import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroSection from '@/Components/Public/HeroSection';
import ProductCard from '@/Components/Public/ProductCard';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Article, Product, Review, ShopSetting } from '@/types/mebel';
import { ArrowRight, Hammer, Sofa, Truck, Star } from 'lucide-react';
import { safeArray } from '@/lib/utils';

interface HomeProps {
    heroArticles: Article[];
    topProducts: Product[];
    reviews: Review[];
    shopSettings: ShopSetting;
}

export default function Home({ heroArticles, topProducts, reviews, shopSettings }: HomeProps) {
    const waNumber = shopSettings?.whatsapp_number || '6281234567890';
    const waTemplate = shopSettings?.whatsapp_template || '';
    const heroTitle = shopSettings?.hero_banner_text_1 || 'Gerobak dan Meubel Berkualitas';
    const heroSubtitle = shopSettings?.hero_banner_text_2 || 'Solusi custom untuk usaha dan kebutuhan rumah';
    const heroBg = shopSettings?.hero_banner_bg;

    const safeHeroArticles = safeArray(heroArticles);
    const safeTopProducts = safeArray(topProducts);
    const safeReviews = safeArray(reviews);

    return (
        <PublicLayout>
            <Head>
                <title>{shopSettings?.shop_name || 'PaiTech'} | {shopSettings?.hero_banner_text_1 || 'Transformasi Digital untuk Bisnis Modern'}</title>
                <meta name="description" content={shopSettings?.description || 'Solusi teknologi terpadu untuk transformasi digital bisnis Anda'} />
            </Head>

            {/* Section Hero Banner */}
            {safeHeroArticles.length > 0 ? (
                <HeroSection articles={safeHeroArticles} />
            ) : (
                <div className="relative overflow-hidden py-16 sm:py-24 bg-[#F1F1F1]">
                    <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-6 space-y-4 text-primary-900">
                                <span className="bg-accent-500 text-primary-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                                    Tech Solution
                                </span>
                                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                                    {heroTitle}
                                </h1>
                                <p className="text-sm sm:text-base text-primary-700 leading-relaxed font-light">
                                    {heroSubtitle}
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <Link href={route('products.index')} className="px-6 py-3 bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold rounded-xl shadow-md transition text-xs">
                                        Jelajahi Produk
                                    </Link>
                                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white hover:bg-gray-50 text-primary-900 font-bold rounded-xl border border-gray-300 transition text-xs">
                                        Konsultasi Custom
                                    </a>
                                </div>
                            </div>
                            <div className="lg:col-span-6 h-[300px] sm:h-[380px] rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={
                                        heroBg
                                            ? (heroBg.startsWith('http') || heroBg.startsWith('/') ? heroBg : `/storage/${heroBg}`)
                                            : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1800'
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Hero Banner"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Keunggulan Toko */}
            <section className="py-12 bg-white">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ScrollReveal delay={100} direction="up">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex gap-4 items-start hover:shadow-md hover:border-accent-500 transition">
                                <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                    <Sofa className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-primary-900">100% Kayu Jati Pilihan</h3>
                                    <p className="text-primary-600 text-xs leading-relaxed">Material kayu jati berkualitas kokoh, awet, dan tahan lama.</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={250} direction="up">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex gap-4 items-start hover:shadow-md hover:border-accent-500 transition">
                                <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                    <Hammer className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-primary-900">Custom Desain</h3>
                                    <p className="text-primary-600 text-xs leading-relaxed">Bisa pesan ukuran, warna finishing, dan model sesuai selera.</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={400} direction="up">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex gap-4 items-start hover:shadow-md hover:border-accent-500 transition">
                                <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-primary-900">Pengiriman Aman</h3>
                                    <p className="text-primary-600 text-xs leading-relaxed">Pengiriman ke berbagai wilayah dengan proteksi aman.</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Katalog Produk Unggulan dengan Animasi Scroll Reveal */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
                <ScrollReveal direction="up">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900">Produk Terbaru</h2>
                        </div>
                        <div>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary-800 text-primary-800 text-xs font-bold hover:bg-primary-800 hover:text-white transition"
                            >
                                Lihat Semua Produk
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>

                {safeTopProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {safeTopProducts.map((product, index) => (
                            <ScrollReveal key={product?.id ?? index} delay={(index % 4) * 150} direction="up">
                                <ProductCard
                                    product={product}
                                    whatsappNumber={waNumber}
                                    whatsappTemplate={waTemplate}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                ) : (
                    <ScrollReveal direction="none">
                        <div className="bg-white p-10 text-center rounded-2xl border border-gray-200 shadow-xs space-y-3 max-w-md mx-auto">
                            <Sofa className="mx-auto h-8 w-8 text-primary-800" />
                            <h3 className="text-base font-bold text-primary-900">Belum Ada Produk</h3>
                            <p className="text-primary-600 text-xs leading-relaxed">Katalog produk belum diunggah. Silakan hubungi kami via WhatsApp.</p>
                        </div>
                    </ScrollReveal>
                )}
            </section>

            {/* Testimoni */}
            {safeReviews.length > 0 && (
                <section className="py-16 bg-[#F1F1F1]">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="up">
                            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900">Testimoni Pelanggan</h2>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {safeReviews.map((rev, index) => {
                                const revName   = rev?.name ?? 'Pelanggan';
                                const revCity   = rev?.city ?? '';
                                const revRating = typeof rev?.rating === 'number' && rev.rating >= 1 && rev.rating <= 5 ? rev.rating : 5;
                                const revReview = rev?.review ?? '';
                                const revId     = rev?.id ?? index;

                                return (
                                    <ScrollReveal key={revId} delay={index * 150} direction="up">
                                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between h-full hover:shadow-md hover:border-accent-500 transition">
                                            <div className="space-y-3">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < revRating ? 'fill-accent-500 text-accent-500' : 'text-gray-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                                {revReview && (
                                                    <p className="text-primary-600 text-xs leading-relaxed italic">
                                                        "{revReview}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center font-bold text-primary-900 border border-accent-500/30 text-xs">
                                                    {revName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-primary-900">{revName}</h4>
                                                    {revCity && <span className="text-[10px] text-primary-500 block">{revCity}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
