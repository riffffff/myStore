import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Pagination from '@/Components/Public/Pagination';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Article, ShopSetting } from '@/types/mebel';
import { ArrowRight, Clock3, Newspaper } from 'lucide-react';
import { getImageUrl, formatDate, safeArray } from '@/lib/utils';

const DEFAULT_ARTICLE_IMG = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        links: any[];
    };
    shopSettings: ShopSetting;
}

export default function Index({ articles, shopSettings }: ArticlesIndexProps) {
    const articlesData  = safeArray(articles?.data);
    const articlesLinks = Array.isArray(articles?.links) ? articles.links : [];

    return (
        <PublicLayout>
            <Head>
                <title>Artikel & Insight Teknologi | {shopSettings?.shop_name || 'PaiTech'}</title>
                <meta name="description" content="Dapatkan insight terbaru seputar teknologi, digital transformation, AI, cloud computing, cybersecurity, dan tips mengembangkan bisnis digital." />
            </Head>

            {/* Hero Banner */}
            <div className="bg-mahogany-900 py-16 sm:py-20 text-center text-white relative overflow-hidden wood-texture">
                <div className="absolute inset-0 bg-linear-to-b from-mahogany-950/60 to-mahogany-900/30 pointer-events-none" />
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Artikel & Info</h1>
                    <p className="text-sm sm:text-base text-mahogany-200 max-w-2xl mx-auto leading-relaxed">
                        Panduan lengkap, informasi material kayu jati, tips perawatan furniture, serta ide tata ruang interior untuk hunian Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                                        <article className="group bg-white rounded-2xl overflow-hidden border border-mahogany-100/60 shadow-sm hover:shadow-xl hover:border-mahogany-300/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

                                            {/* Gambar */}
                                            <Link href={route('articles.show', artSlug)} className="block aspect-[16/10] overflow-hidden bg-mahogany-50 relative">
                                                <img
                                                    src={imageUrl}
                                                    alt={artTitle}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                                {artIsHero && (
                                                    <span className="absolute top-4 left-4 bg-mahogany-800 text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                        Unggulan
                                                    </span>
                                                )}
                                                {/* Vignette */}
                                                <div className="absolute inset-0 bg-linear-to-t from-mahogany-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </Link>

                                            {/* Konten */}
                                            <div className="p-6 flex flex-col grow">
                                                {formattedDate && (
                                                    <div className="text-xs text-mahogany-400 font-semibold mb-2 flex items-center gap-1.5">
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        <span>{formattedDate}</span>
                                                    </div>
                                                )}

                                                <h3 className="text-base font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-mahogany-800 transition-colors duration-200">
                                                    <Link href={route('articles.show', artSlug)}>
                                                        {artTitle}
                                                    </Link>
                                                </h3>

                                                <p className="mt-2.5 text-xs text-stone-500 leading-relaxed line-clamp-3 grow">
                                                    {artExcerpt}
                                                </p>

                                                <div className="mt-5 pt-4 border-t border-mahogany-50">
                                                    <Link
                                                        href={route('articles.show', artSlug)}
                                                        className="text-xs font-bold text-mahogany-700 hover:text-mahogany-900 transition flex items-center gap-1 group/btn"
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
                        <div className="bg-white p-16 text-center rounded-2xl border border-mahogany-100 shadow-sm max-w-md mx-auto space-y-4">
                            <Newspaper className="mx-auto h-12 w-12 text-mahogany-700" />
                            <h3 className="text-lg font-bold text-stone-900">Belum Ada Artikel</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                Saat ini kami belum menerbitkan artikel. Silakan kembali lagi di lain waktu.
                            </p>
                            <Link
                                href={route('home')}
                                className="inline-flex px-5 py-2.5 bg-mahogany-800 hover:bg-mahogany-700 text-white font-bold rounded-xl shadow-sm transition text-xs"
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
