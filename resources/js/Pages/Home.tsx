import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import HeroSection from '@/Components/Public/HeroSection';
import ProductCard from '@/Components/Public/ProductCard';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Article, Product, Review, ShopSetting } from '@/types/store';
import { ArrowRight, Shield, Zap, Cloud, Star, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { safeArray, getSafeShopSettings } from '@/lib/utils';

interface HomeProps {
    heroArticles: Article[];
    topProducts: Product[];
    reviews: Review[];
    shopSettings?: ShopSetting;
}

export default function Home({ heroArticles, topProducts, reviews, shopSettings }: HomeProps) {
    const safeSettings = getSafeShopSettings(shopSettings);
    const waNumber = safeSettings.whatsapp_number;
    const waTemplate = safeSettings.whatsapp_template;
    const heroTitle = safeSettings.hero_banner_text_1 ?? '';
    const heroSubtitle = safeSettings.hero_banner_text_2 ?? '';
    const heroBg = safeSettings.hero_banner_bg;
    const shopName = safeSettings.shop_name ?? '';
    const shopDescription = safeSettings.description ?? '';
    const metaDescription = shopDescription;

    const safeHeroArticles = safeArray(heroArticles);
    const safeTopProducts = safeArray(topProducts);
    const safeReviews = safeArray(reviews).slice(0, 9);

    const [showAllReviews, setShowAllReviews] = useState(false);
    const hasMoreReviews = safeReviews.length > 3;

    return (
        <PublicLayout>
            <Head title={shopName}>
                <meta name="description" content={metaDescription} />
            </Head>

            {/* Section Hero Banner */}
            {safeHeroArticles.length > 0 ? (
                <HeroSection articles={safeHeroArticles} />
            ) : (
                <div className="relative overflow-hidden py-16 sm:py-24 bg-[#F1F1F1]">
                    <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-6 space-y-4 text-primary-900">
                                <span className="bg-accent-500 text-[var(--color-primary-contrast,#ffffff)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                                    Tech Solution
                                </span>
                                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                                    {heroTitle}
                                </h1>
                                <p className="text-sm sm:text-base text-primary-700 leading-relaxed font-light">
                                    {heroSubtitle}
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <Link href={route('products.index')} className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-[var(--color-primary-contrast,#ffffff)] font-bold rounded-xl shadow-md transition text-xs">
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

            {/* Keunggulan Toko - Mobile: marquee auto-scroll tulisan berjalan, Desktop: grid 3 col */}
            <style>{`
              @keyframes marquee-features {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @media (max-width: 767px) {
                .animate-marquee-features {
                  animation: marquee-features 28s linear infinite;
                }
                .group-marquee:hover .animate-marquee-features {
                  animation-play-state: paused;
                }
              }
            `}</style>
            <section className="py-6 sm:py-12 bg-white overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 group-marquee">
                    {/* Desktop: grid 3 kolom normal */}
                    <div className="hidden md:grid md:grid-cols-3 gap-6">
                        <ScrollReveal delay={100} direction="up">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex gap-4 items-start hover:shadow-md hover:border-accent-500 transition h-full">
                                <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-primary-900">Kualitas Terjamin</h3>
                                    <p className="text-primary-600 text-xs leading-relaxed">Produk dibuat dengan material pilihan berkualitas tinggi dan standar pengerjaan terbaik.</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={250} direction="up">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex gap-4 items-start hover:shadow-md hover:border-accent-500 transition h-full">
                                <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-primary-900">Transaksi Aman</h3>
                                    <p className="text-primary-600 text-xs leading-relaxed">Pilihan pembayaran mudah dan aman, didukung layanan pemesanan yang responsif.</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={400} direction="up">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex gap-4 items-start hover:shadow-md hover:border-accent-500 transition h-full">
                                <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                    <Cloud className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-primary-900">Pengiriman Cepat</h3>
                                    <p className="text-primary-600 text-xs leading-relaxed">Pesanan Anda dikemas rapi dan dikirim dengan aman langsung ke alamat tujuan.</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Mobile / Tablet (<md): MARQUEE AUTO-SCROLL (tulisan berjalan infinite) */}
                    <div className="md:hidden overflow-hidden -mx-4 px-4">
                        {/* Duplicate cards 2x untuk seamless loop di 50% translateX */}
                        <div className="flex animate-marquee-features w-max gap-3.5 sm:gap-6">
                            {/* SET 1 */}
                            <div className="shrink-0 w-[80vw] sm:w-[48vw]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex gap-3.5 sm:gap-4 items-start h-full">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary-900">Kualitas Terjamin</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">Produk dibuat dengan material pilihan berkualitas tinggi dan standar pengerjaan terbaik.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 w-[80vw] sm:w-[48vw]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex gap-3.5 sm:gap-4 items-start h-full">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary-900">Transaksi Aman</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">Pilihan pembayaran mudah dan aman, didukung layanan pemesanan yang responsif.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 w-[80vw] sm:w-[48vw]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex gap-3.5 sm:gap-4 items-start h-full">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        <Cloud className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary-900">Pengiriman Cepat</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">Pesanan Anda dikemas rapi dan dikirim dengan aman langsung ke alamat tujuan.</p>
                                    </div>
                                </div>
                            </div>

                            {/* SET 2 (duplikat SET 1) - dibuat persis sama untuk seamless loop */}
                            <div className="shrink-0 w-[80vw] sm:w-[48vw]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex gap-3.5 sm:gap-4 items-start h-full">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary-900">Kualitas Terjamin</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">Produk dibuat dengan material pilihan berkualitas tinggi dan standar pengerjaan terbaik.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 w-[80vw] sm:w-[48vw]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex gap-3.5 sm:gap-4 items-start h-full">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary-900">Transaksi Aman</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">Pilihan pembayaran mudah dan aman, didukung layanan pemesanan yang responsif.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 w-[80vw] sm:w-[48vw]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex gap-3.5 sm:gap-4 items-start h-full">
                                    <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        <Cloud className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-primary-900">Pengiriman Cepat</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">Pesanan Anda dikemas rapi dan dikirim dengan aman langsung ke alamat tujuan.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Katalog Produk Unggulan (2 Kolom di Mobile) */}
            <section className="py-6 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
                <ScrollReveal direction="up">
                    <div className="flex flex-row items-end justify-between gap-3 mb-5 sm:mb-10">
                        <div className="space-y-0.5 sm:space-y-1">
                            <h2 className="text-xl sm:text-3xl font-extrabold text-primary-900">Produk Unggulan</h2>
                        </div>
                        <div>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-primary-800 sm:border-2 text-primary-800 text-[11px] sm:text-xs font-bold hover:bg-primary-800 hover:text-white transition"
                            >
                                <span>Lihat Semua</span>
                                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>

                {safeTopProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {safeTopProducts.map((product, index) => (
                            <ScrollReveal
                                key={product?.id ?? index}
                                delay={(index % 4) * 100}
                                direction="up"
                                className={index >= 4 ? 'hidden sm:block' : ''}
                            >
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
                        <div className="bg-white p-8 sm:p-10 text-center rounded-2xl border border-gray-200 shadow-xs space-y-3 max-w-md mx-auto">
                            <Package className="mx-auto h-8 w-8 text-primary-800" />
                            <h3 className="text-sm sm:text-base font-bold text-primary-900">Produk Belum Tersedia</h3>
                            <p className="text-primary-600 text-xs leading-relaxed">Katalog produk akan segera diperbarui. Silakan kembali lagi nanti.</p>
                        </div>
                    </ScrollReveal>
                )}
            </section>

            {/* Testimoni (Mobile Swipeable Snap Carousel / Desktop Grid) */}
            {safeReviews.length > 0 && (
                <section className="pt-5 pb-6 sm:py-16 bg-[#F1F1F1]">
                    {/*
                      Container ini PERSIS SAMA struktur padding dan max-width-nya
                      dengan section "Produk Unggulan" di atas (px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto).
                      TANPA negative margin / padding trick lagi agar card pertama testimoni SEJAJAR persis dengan card produk.
                    */}
                    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
                        <ScrollReveal direction="up">
                            <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2 mb-4 sm:mb-12">
                                <h2 className="text-xl sm:text-3xl font-extrabold text-primary-900">Apa Kata Pelanggan Kami</h2>
                            </div>
                        </ScrollReveal>

                        {/*
                          Mobile: overflow-x-auto langsung (tanpa -mx / pl pr tambahan).
                          Padding kiri berasal dari parent container px-3 → SAMA PERSIS dengan card produk grid.
                        */}
                        <div className="overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none pt-2 pb-2">
                            <div className="flex md:grid md:grid-cols-3 gap-3 sm:gap-6 transition-all duration-300 ease-out w-max md:w-auto">
                                {safeReviews.map((rev, index) => {
                                    const revName   = rev?.name ?? 'Pelanggan';
                                    const revCity   = rev?.city ?? '';
                                    const revRating = typeof rev?.rating === 'number' && rev.rating >= 1 && rev.rating <= 5 ? rev.rating : 5;
                                    const revReview = rev?.review ?? '';
                                    const revId     = rev?.id ?? index;
                                    const isHiddenOnDesktop = !showAllReviews && index >= 3;
                                    const revealDelay = (index % 3) * 120;

                                    const cardContent = (
                                        <div className="bg-white px-5 py-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between h-full hover:-translate-y-1.5 hover:border-accent-400 transition-all duration-300 ease-out">
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < revRating ? 'fill-accent-500 text-accent-500' : 'text-gray-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                                {revReview && (
                                                    <p className="text-primary-600 text-xs leading-relaxed italic line-clamp-4">
                                                        "{revReview}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-4 pt-3 sm:mt-6 sm:pt-4 border-t border-gray-100 flex items-center gap-2.5 sm:gap-3">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent-500/20 flex items-center justify-center font-bold text-primary-900 border border-accent-500/30 text-xs">
                                                    {revName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-primary-900">{revName}</h4>
                                                    {revCity && <span className="text-[10px] text-primary-500 block">{revCity}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );

                                    return (
                                        <div
                                            key={revId}
                                            className={`shrink-0 w-[72vw] sm:w-[48vw] md:w-auto snap-start md:snap-align-none transition-all duration-300 ease-out ${
                                                isHiddenOnDesktop ? 'md:hidden' : ''
                                            }`}
                                        >
                                            <ScrollReveal delay={revealDelay} direction="up" className="h-full">
                                                <div className="h-full">{cardContent}</div>
                                            </ScrollReveal>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {hasMoreReviews && (
                            <div className="hidden md:flex justify-center mt-10">
                                <button
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary-800 text-primary-800 text-sm font-bold hover:bg-primary-800 hover:text-white active:scale-[0.98] transition-all duration-200"
                                >
                                    <span>{showAllReviews ? 'Sembunyikan' : 'Lihat Selengkapnya'}</span>
                                    {showAllReviews ? (
                                        <ChevronUp className="w-4 h-4 transition-transform duration-300" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

        </PublicLayout>
    );
}


