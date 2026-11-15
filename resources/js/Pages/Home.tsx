import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
// import HeroSection from '@/Components/Public/HeroSection';
import ProductCard from '@/Components/Public/ProductCard';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Article, Product, Review, ShopSetting } from '@/types/store';
import { ArrowRight, Shield, Zap, Cloud, Star, Package, Truck, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { safeArray, getSafeShopSettings } from '@/lib/utils';
import Button from '@/Components/Button';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';

function renderFeatureIcon(iconName?: string) {
    switch (iconName?.toLowerCase()) {
        case 'shield':
            return <Shield className="h-5 w-5" />;
        case 'truck':
        case 'cloud':
            return <Truck className="h-5 w-5" />;
        case 'star':
            return <Star className="h-5 w-5" />;
        case 'package':
            return <Package className="h-5 w-5" />;
        case 'zap':
        default:
            return <Zap className="h-5 w-5" />;
    }
}

interface HomeProps {
    // heroArticles?: Article[];
    topProducts: Product[];
    reviews: Review[];
    shopSettings?: ShopSetting;
}

export default function Home({ topProducts, reviews, shopSettings }: HomeProps) {
    const safeSettings = getSafeShopSettings(shopSettings);
    const defaultFeatures = [
        {
            title: 'Kualitas Terjamin',
            description: 'Produk dibuat dengan material pilihan berkualitas tinggi dan standar pengerjaan terbaik.',
            icon: 'zap',
        },
        {
            title: 'Transaksi Aman',
            description: 'Pilihan pembayaran mudah dan aman, didukung layanan pemesanan yang responsif.',
            icon: 'shield',
        },
        {
            title: 'Pengiriman Cepat',
            description: 'Pesanan Anda dikemas rapi dan dikirim dengan aman langsung ke alamat tujuan.',
            icon: 'truck',
        },
    ];
    const storeFeatures = safeArray(safeSettings.store_features);
    const features = [0, 1, 2].map((i) => storeFeatures[i] ?? defaultFeatures[i]);
    const waNumber = safeSettings.whatsapp_number;
    const waTemplate = safeSettings.whatsapp_template;
    const heroTitle = safeSettings.hero_banner_text_1 ?? '';
    const heroSubtitle = safeSettings.hero_banner_text_2 ?? '';
    const heroBg = safeSettings.hero_banner_bg;
    const heroBgMobile = safeSettings.hero_banner_bg_mobile || heroBg;
    const shopName = safeSettings.shop_name ?? '';
    const shopDescription = safeSettings.description ?? '';
    const metaDescription = shopDescription;

    // const safeHeroArticles = safeArray(heroArticles);
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
            {/*
            {safeHeroArticles.length > 0 ? (
                <ScrollReveal direction="up">
                    <HeroSection articles={safeHeroArticles} />
                </ScrollReveal>
            ) : (
            */}
                <ScrollReveal direction="up">
                <section className="w-full max-w-360 mx-auto">
                    {/* ══════════ MOBILE — Gambar Menyatu dengan Judul & Deskripsi ══════════ */}
                    <div className="md:hidden px-4 sm:px-6 pt-3 pb-3 w-full">
                        <div
                            className="relative w-full overflow-hidden rounded-[28px] border border-white/10 shadow-2xl select-none h-102.5 sm:h-110 flex flex-col justify-between"
                            style={{
                                background: 'color-mix(in srgb, var(--color-header-bg, #0B132B) 90%, black)',
                            }}
                        >
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={
                                        heroBgMobile
                                            ? (heroBgMobile.startsWith('http') || heroBgMobile.startsWith('/') ? heroBgMobile : `/storage/${heroBgMobile}`)
                                            : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600'
                                    }
                                    alt={heroTitle || shopName || 'Hero Banner'}
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/40" />
                            </div>

                            <div className="relative z-20 flex flex-col items-center text-center px-4 pt-4 pb-5 mt-auto">
                                <h1 className="text-white text-xl sm:text-2xl font-serif font-bold uppercase tracking-[0.16em] leading-snug drop-shadow-md line-clamp-2">
                                    {heroTitle || shopName}
                                </h1>
                                <div
                                    className="w-10 h-1 rounded-full my-2.5 shadow-sm"
                                    style={{ background: 'var(--header-active, var(--color-accent, #F5E8AA))' }}
                                />
                                {(heroSubtitle || shopDescription) && (
                                    <p className="text-white/80 text-xs leading-relaxed max-w-xs line-clamp-2 mb-4 drop-shadow">
                                        {heroSubtitle || shopDescription}
                                    </p>
                                )}
                                <div className="flex items-center justify-center w-full max-w-xs">
                                    <Link
                                        href={route('products.index')}
                                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/35 text-white font-bold text-xs uppercase tracking-[0.16em] backdrop-blur-md border border-white/35 shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
                                    >
                                        <span>Jelajahi Produk</span>
                                        <ChevronRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══════════ DESKTOP ══════════ */}
                    <div className="hidden md:block pt-4 sm:pt-6 pb-2 sm:pb-3 px-4 sm:px-6 lg:px-8">
                        <div
                            className="relative overflow-hidden rounded-3xl border shadow-xl p-8 lg:p-10"
                            style={{
                                backgroundColor: 'var(--color-card-article-bg, #FFFFFF)',
                                borderColor: 'var(--color-card-article-border, #E5E7EB)',
                            }}
                        >
                            <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-800/5 blur-3xl" />

                            <div className="relative z-10 grid grid-cols-12 gap-8 lg:gap-10 items-center">
                                <div className="col-span-5 flex flex-col justify-between space-y-6 text-primary-900">
                                    <div className="space-y-4">
                                        {shopName && (
                                            <span className="bg-accent-500 text-(--color-primary-contrast,#ffffff) text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                                                {shopName}
                                            </span>
                                        )}
                                        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
                                            {heroTitle || shopName}
                                        </h1>
                                        {(heroSubtitle || shopDescription) && (
                                            <p className="text-primary-700 text-sm leading-relaxed line-clamp-3">
                                                {heroSubtitle || shopDescription}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button href={route('products.index')} variant="primary" size="md">
                                            Jelajahi Produk
                                        </Button>
                                        <Button
                                            href={`https://wa.me/${waNumber}`}
                                            external
                                            variant="outline"
                                            size="md"
                                            leftIcon={<WhatsAppIcon className="w-4 h-4 text-whatsapp" />}
                                        >
                                            Konsultasi Custom
                                        </Button>
                                    </div>
                                </div>

                                <div className="col-span-7 relative h-80 lg:h-110 rounded-3xl overflow-hidden shadow-2xl border border-white/60 select-none">
                                    <img
                                        src={
                                            heroBg
                                                ? (heroBg.startsWith('http') || heroBg.startsWith('/') ? heroBg : `/storage/${heroBg}`)
                                                : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600'
                                        }
                                        className="w-full h-full object-cover"
                                        alt={heroTitle || shopName || 'Hero Banner'}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                </ScrollReveal>
            {/* )} */}

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
            <ScrollReveal direction="up" delay={50}>
            <section className="py-2 sm:py-4 overflow-hidden">
                <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 group-marquee">
                    {/* Desktop: grid normal */}
                    <div className="hidden md:grid md:grid-cols-3 gap-6">
                        {features.map((feat, idx) => (
                            <ScrollReveal key={idx} delay={100 + idx * 150} direction="up">
                                <div
                                    className="p-6 rounded-2xl border shadow-xs flex gap-4 items-start hover:shadow-md transition h-full"
                                    style={{
                                        backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                        borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                    }}
                                >
                                    <div className="w-11 h-11 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                        {renderFeatureIcon(feat.icon)}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-primary-900">{feat.title}</h3>
                                        <p className="text-primary-600 text-xs leading-relaxed">{feat.description}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Mobile / Tablet (<md): MARQUEE AUTO-SCROLL (tulisan berjalan infinite) */}
                    <div className="md:hidden overflow-hidden -mx-4 px-4">
                        <div className="flex animate-marquee-features w-max gap-3.5 sm:gap-6">
                            {/* SET 1 */}
                            {features.map((feat, idx) => (
                                <div key={`f1-${idx}`} className="shrink-0 w-[80vw] sm:w-[48vw]">
                                    <div
                                        className="p-4 sm:p-5 rounded-2xl border shadow-xs flex gap-3.5 sm:gap-4 items-start h-full"
                                        style={{
                                            backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                            borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                            {renderFeatureIcon(feat.icon)}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-primary-900">{feat.title}</h3>
                                            <p className="text-primary-600 text-xs leading-relaxed">{feat.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* SET 2 (duplikat SET 1 untuk seamless loop) */}
                            {features.map((feat, idx) => (
                                <div key={`f2-${idx}`} className="shrink-0 w-[80vw] sm:w-[48vw]">
                                    <div
                                        className="p-4 sm:p-5 rounded-2xl border shadow-xs flex gap-3.5 sm:gap-4 items-start h-full"
                                        style={{
                                            backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                            borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-primary-900 flex items-center justify-center shrink-0">
                                            {renderFeatureIcon(feat.icon)}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-primary-900">{feat.title}</h3>
                                            <p className="text-primary-600 text-xs leading-relaxed">{feat.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            </ScrollReveal>

            {/* Katalog Produk Unggulan (2 Kolom di Mobile) */}
            <section className="pt-3 sm:pt-5 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-360 mx-auto w-full">
                <ScrollReveal direction="up">
                    <div className="flex flex-row items-end justify-between gap-3 mb-4 sm:mb-6">
                        <div className="space-y-0.5 sm:space-y-1">
                            <h2 className="text-xl sm:text-3xl font-extrabold text-primary-900">Produk Unggulan</h2>
                        </div>
                        <div>
                            <Button
                                href={route('products.index')}
                                variant="outline"
                                size="sm"
                                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                            >
                                Lihat Semua
                            </Button>
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
                        <div
                            className="p-8 sm:p-10 text-center rounded-2xl border shadow-xs space-y-3 max-w-md mx-auto"
                            style={{
                                backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                borderColor: 'var(--color-card-product-border, #EBD9AC)',
                            }}
                        >
                            <Package className="mx-auto h-8 w-8 text-primary-800" />
                            <h3 className="text-sm sm:text-base font-bold text-primary-900">Produk Belum Tersedia</h3>
                            <p className="text-primary-600 text-xs leading-relaxed">Katalog produk akan segera diperbarui. Silakan kembali lagi nanti.</p>
                        </div>
                    </ScrollReveal>
                )}
            </section>

            {/* Testimoni (Mobile Swipeable Snap Carousel / Desktop Grid) */}
            {safeReviews.length > 0 && (
                <section
                    className="pt-5 pb-6 sm:py-16 transition-colors"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-bg, var(--page-bg, #FCF6E5)) 85%, var(--color-primary, #6E4F78) 15%)',
                    }}
                >
                    {/*
                      Container ini PERSIS SAMA struktur padding dan max-width-nya
                      dengan section "Produk Unggulan" di atas (px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto).
                      TANPA negative margin / padding trick lagi agar card pertama testimoni SEJAJAR persis dengan card produk.
                    */}
                    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="up">
                            <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2 mb-4 sm:mb-12">
                                <h2 className="text-xl sm:text-3xl font-extrabold text-primary-900">Apa Kata Pelanggan Kami</h2>
                            </div>
                        </ScrollReveal>

                        {/*
                          Mobile: overflow-x-auto overflow-y-hidden untuk mencegah card bisa digeser ke atas / terpotong.
                          ScrollReveal dipasang di container utama agar tidak memicu translate-y internal pada tiap card.
                        */}
                        <ScrollReveal direction="up" delay={100}>
                            <div className="overflow-x-auto overflow-y-hidden md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none py-2.5 overscroll-x-contain">
                                <div className="flex md:grid md:grid-cols-3 gap-3 sm:gap-6 transition-all duration-300 ease-out w-max md:w-auto items-stretch">
                                    {safeReviews.map((rev, index) => {
                                        const revName   = rev?.name ?? 'Pelanggan';
                                        const revCity   = rev?.city ?? '';
                                        const revRating = typeof rev?.rating === 'number' && rev.rating >= 1 && rev.rating <= 5 ? rev.rating : 5;
                                        const revReview = rev?.review ?? '';
                                        const revId     = rev?.id ?? index;
                                        const isHiddenOnDesktop = !showAllReviews && index >= 3;

                                        return (
                                            <div
                                                key={revId}
                                                className={`shrink-0 w-[72vw] sm:w-[48vw] md:w-auto snap-start md:snap-align-none transition-all duration-300 ease-out flex flex-col ${
                                                    isHiddenOnDesktop ? 'md:hidden' : ''
                                                }`}
                                            >
                                                <div
                                                    className="px-5 py-4 sm:p-6 rounded-2xl border shadow-xs flex flex-col justify-between h-full md:hover:-translate-y-1.5 transition-all duration-300 ease-out"
                                                    style={{
                                                        backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                                        borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                                    }}
                                                >
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <div className="flex gap-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < revRating ? 'fill-accent-500 text-accent-500' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        {revReview && (
                                                            <p className="text-primary-600 text-xs leading-relaxed italic line-clamp-4">
                                                                "{revReview}"
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="mt-4 pt-3 sm:mt-6 sm:pt-4 border-t flex items-center gap-2.5 sm:gap-3"
                                                        style={{
                                                            borderColor: 'color-mix(in srgb, var(--color-card-product-border, #EBD9AC) 60%, transparent)',
                                                        }}
                                                    >
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent-500/20 flex items-center justify-center font-bold text-primary-900 border border-accent-500/30 text-xs">
                                                            {revName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-primary-900">{revName}</h4>
                                                            {revCity && <span className="text-[10px] text-primary-500 block">{revCity}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </ScrollReveal>

                        {hasMoreReviews && (
                            <div className="hidden md:flex justify-center mt-10">
                                <Button
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    variant="outline"
                                    size="md"
                                    rightIcon={
                                        showAllReviews ? (
                                            <ChevronUp className="w-4 h-4 transition-transform duration-300" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                                        )
                                    }
                                >
                                    {showAllReviews ? 'Sembunyikan' : 'Lihat Selengkapnya'}
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            )}

        </PublicLayout>
    );
}


