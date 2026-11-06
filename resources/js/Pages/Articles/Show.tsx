import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Article, ShopSetting } from '@/types/store';
import { PageProps } from '@/types';
import { getImageUrl, formatDate, getSafeShopSettings } from '@/lib/utils';
import WhatsAppButton from '@/Components/Public/WhatsAppButton';

interface ArticleShowProps {
    article: Article;
    shopSettings?: ShopSetting;
}

const DEFAULT_ARTICLE_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600';

export default function Show({ article, shopSettings }: ArticleShowProps) {
    const { shopSettings: globalShopSettings } = usePage<PageProps>().props;
    const safeSettings = getSafeShopSettings(shopSettings || globalShopSettings);
    const waNumber = safeSettings.whatsapp_number;
    const shopName = safeSettings.shop_name;

    const articleTitle = article?.title ?? 'Artikel';
    const articleExcerpt = article?.excerpt ?? '';
    const articleImage = article?.image ?? '';
    const articleContent = article?.content ?? '';
    const articlePublishedAt = article?.published_at ?? new Date().toISOString();

    const imageUrl = getImageUrl(articleImage, DEFAULT_ARTICLE_IMAGE);
    const formattedDate = formatDate(articlePublishedAt);

    const pageTitle = shopName ?? '';
    const metaDescription = articleExcerpt || 'Baca artikel dan tips bermanfaat seputar produk unggulan kami.';
    const canonicalUrl = route('articles.show', article.slug);
    const articleJsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleTitle,
        description: metaDescription,
        image: imageUrl,
        datePublished: articlePublishedAt,
        dateModified: article.updated_at || articlePublishedAt,
        author: { '@type': 'Organization', name: shopName },
        publisher: { '@type': 'Organization', name: shopName },
        mainEntityOfPage: canonicalUrl,
    }).replace(/</g, '\\u003c');

    return (
        <PublicLayout>
            <Head title={pageTitle}>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href={canonicalUrl} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
            </Head>

            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-12">
                <nav className="text-xs sm:text-sm text-stone-400 mb-5 sm:mb-8 flex items-center gap-2" aria-label="Breadcrumb">
                    <Link href={route('home')} className="hover:text-stone-900 transition">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('articles.index')} className="hover:text-stone-900 transition">
                        Artikel
                    </Link>
                    <span>/</span>
                    <span className="text-stone-900 font-bold truncate max-w-55 sm:max-w-none">{articleTitle}</span>
                </nav>

                <ScrollReveal direction="up">
                    <article
                        className="max-w-4xl mx-auto rounded-3xl border shadow-xs overflow-hidden p-6 sm:p-10 lg:p-12 space-y-8"
                        style={{
                            backgroundColor: 'var(--color-card-article-bg, #FFFFFF)',
                            borderColor: 'var(--color-card-article-border, #E5E7EB)',
                        }}
                    >

                        <header className="space-y-4 text-center">
                            <div className="flex justify-center items-center gap-2 text-xs text-stone-400 font-semibold uppercase tracking-wider">
                                <span>Artikel</span>
                                {formattedDate && (
                                    <>
                                        <span>•</span>
                                        <time dateTime={articlePublishedAt}>{formattedDate}</time>
                                    </>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 tracking-tight leading-snug max-w-3xl mx-auto">
                                {articleTitle}
                            </h1>

                            {articleExcerpt && (
                                <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto italic">
                                    "{articleExcerpt}"
                                </p>
                            )}
                        </header>

                        {imageUrl && (
                            <div className="aspect-21/10 bg-stone-100 rounded-2xl overflow-hidden shadow-inner border border-stone-200/20">
                                <img
                                    src={imageUrl}
                                    alt={articleTitle}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        )}

                        {articleContent && (
                            <div
                                className="prose prose-stone prose-amber max-w-none text-stone-700 leading-relaxed text-sm sm:text-base space-y-6 pt-4 border-t border-stone-100 **:[[align='justify']]:text-justify **:[[style*='text-align:_justify']]:text-justify"
                                dangerouslySetInnerHTML={{ __html: articleContent }}
                            />
                        )}

                        <footer className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-500">
                            <div>
                                <span>Diterbitkan oleh: {shopName}</span>
                            </div>
                            <div>
                                <span>Hak Cipta Dilindungi.</span>
                            </div>
                        </footer>

                    </article>
                </ScrollReveal>

                <ScrollReveal delay={200} direction="up">
                    <div
                        className="max-w-4xl mx-auto mt-8 sm:mt-12 p-6 sm:p-8 rounded-3xl border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
                        style={{
                            backgroundColor: 'var(--color-card-article-bg, #FFFFFF)',
                            borderColor: 'var(--color-card-article-border, #E5E7EB)',
                        }}
                    >
                        <div className="space-y-1.5 text-center md:text-left">
                            <h3
                                className="text-base sm:text-lg font-bold leading-tight"
                                style={{ color: 'var(--color-card-article-title, #262626)' }}
                            >
                                Punya Pertanyaan Seputar Produk?
                            </h3>
                            <p
                                className="text-xs max-w-md leading-relaxed opacity-75"
                                style={{ color: 'var(--color-card-article-text, #4B5563)' }}
                            >
                                Hubungi tim kami langsung via WhatsApp untuk konsultasi dan pemesanan produk dengan mudah.
                            </p>
                        </div>
                        <WhatsAppButton
                            href={`https://wa.me/${waNumber}`}
                            fullWidth
                            className="md:w-auto shadow-xs"
                        >
                            Chat via WhatsApp
                        </WhatsAppButton>
                    </div>
                </ScrollReveal>

            </div>
        </PublicLayout>
    );
}
