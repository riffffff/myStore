import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Pagination from '@/Components/Public/Pagination';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Article, ShopSetting } from '@/types/store';
import { ArrowRight, Clock3, Newspaper } from 'lucide-react';
import { getImageUrl, formatDate, safeArray, getSafeShopSettings } from '@/lib/utils';

const DEFAULT_ARTICLE_IMG = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        links: any[];
    };
    shopSettings?: ShopSetting;
}

export default function Index({ articles, shopSettings }: ArticlesIndexProps) {
    const safeSettings = getSafeShopSettings(shopSettings);
    const shopName = safeSettings.shop_name ?? '';
    const articlesData  = safeArray(articles?.data);
    const articlesLinks = Array.isArray(articles?.links) ? articles.links : [];

    const metaDescription = 'Inspirasi, panduan, dan artikel informasi terbaru dari toko kami.';

    return (
        <PublicLayout>
            <Head title={shopName}>
                <meta name="description" content={metaDescription} />
            </Head>

            {/* Hero Banner */}
            <div
                className="hidden sm:block py-16 sm:py-20 text-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)' }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Artikel & Informasi</h1>
                    <p className="text-sm sm:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
                        Inspirasi, panduan, dan berita seputar produk dan tren menarik untuk Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 sm:py-16">
                {articlesData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articlesData.map((article, index) => {
                                const artImage      = article?.image ?? '';
                                const imageUrl      = getImageUrl(artImage, DEFAULT_ARTICLE_IMG);
                                const artTitle      = article?.title ?? '';
                                const artSlug       = article?.slug ?? '';
                                const artExcerpt    = article?.excerpt ?? '';
                                const artPublishedAt = article?.published_at ?? '';
                                const artIsHero     = article?.is_hero ?? false;
                                const artId         = article?.id ?? index;

                                const formattedDate = formatDate(artPublishedAt);

                                return (
                                    <ScrollReveal key={artId} delay={(index % 3) * 150} direction="up">
                                        <article
                                            className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border"
                                            style={{
                                                backgroundColor: 'var(--color-card-article-bg)',
                                                borderColor: 'var(--color-card-article-border)',
                                                color: 'var(--color-card-article-text)',
                                            }}
                                        >

                                            {/* Gambar */}
                                            <Link href={route('articles.show', artSlug)} className="block aspect-[16/10] overflow-hidden bg-gray-100 relative">
                                                <img
                                                    src={imageUrl}
                                                    alt={artTitle}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                                {artIsHero && (
                                                    <span
                                                        className="absolute top-4 left-4 text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm"
                                                        style={{ backgroundColor: 'var(--color-card-article-tag)' }}
                                                    >
                                                        Unggulan
                                                    </span>
                                                )}
                                                {/* Vignette */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </Link>

                                            {/* Konten */}
                                            <div className="p-6 flex flex-col grow">
                                                {formattedDate && (
                                                    <div
                                                        className="text-xs font-semibold mb-2 flex items-center gap-1.5 opacity-60"
                                                        style={{ color: 'var(--color-card-article-tag)' }}
                                                    >
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        <span>{formattedDate}</span>
                                                    </div>
                                                )}

                                                <h3
                                                    className="text-base font-bold line-clamp-2 leading-snug transition-colors duration-200"
                                                    style={{ color: 'var(--color-card-article-title)' }}
                                                >
                                                    <Link href={route('articles.show', artSlug)}>
                                                        {artTitle}
                                                    </Link>
                                                </h3>

                                                <p className="mt-2.5 text-xs leading-relaxed line-clamp-3 grow opacity-70">
                                                    {artExcerpt}
                                                </p>

                                                <div
                                                    className="mt-5 pt-4 border-t"
                                                    style={{ borderColor: 'var(--color-card-article-border)' }}
                                                >
                                                    <Link
                                                        href={route('articles.show', artSlug)}
                                                        className="text-xs font-bold transition flex items-center gap-1 group/btn"
                                                        style={{ color: 'var(--color-card-article-tag)' }}
                                                    >
                                                        Baca Selengkapnya
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                        <Pagination links={articlesLinks} />
                    </>
                ) : (
                    <ScrollReveal direction="none">
                        <div className="bg-white p-16 text-center rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto space-y-4">
                            <Newspaper className="mx-auto h-12 w-12 text-primary-700" />
                            <h3 className="text-lg font-bold text-stone-900">Belum Ada Artikel</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                Artikel dan informasi terbaru akan segera hadir di sini.
                            </p>
                            <Link
                                href={route('home')}
                                className="inline-flex px-5 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition text-xs"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </PublicLayout>
    );
}
