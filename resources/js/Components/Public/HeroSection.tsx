import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Article } from '@/types/mebel';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Eye } from 'lucide-react';
import { safeArray, formatDate } from '@/lib/utils';

const DEFAULT_HERO_IMG = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600';

interface HeroSectionProps {
    articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
    const validArticles = safeArray(articles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const count = validArticles.length;

    useEffect(() => {
        if (count <= 1 || isPaused) return;
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % count);
        }, 6000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [count, isPaused, currentIndex]);

    if (count === 0) return null;

    const currentArticle = validArticles[currentIndex];
    const artTitle      = currentArticle?.title ?? 'Gerobak dan Meubel Berkualitas';
    const artSlug       = currentArticle?.slug ?? '';
    const artExcerpt    = currentArticle?.excerpt ?? '';
    const artPublishedAt = currentArticle?.published_at ?? '';

    const formattedDate = formatDate(artPublishedAt);

    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + count) % count);
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % count);

    return (
        <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full bg-white">
            <div
                className="relative overflow-hidden rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 bg-[#F1F1F1]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* ── Kolom Teks ──────────────────────────────── */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-primary-900 order-2 lg:order-1">
                        <div className="space-y-4">

                            {/* Pause button */}
                            {count > 1 && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsPaused(!isPaused)}
                                        className="p-1.5 rounded-lg bg-white/80 text-primary-600 hover:text-primary-900 transition backdrop-blur-sm"
                                        title={isPaused ? 'Putar Slider' : 'Jeda Slider'}
                                    >
                                        {isPaused
                                            ? <Play className="h-3.5 w-3.5" />
                                            : <Pause className="h-3.5 w-3.5" />
                                        }
                                    </button>
                                </div>
                            )}

                            {formattedDate && (
                                <span className="text-primary-600 text-xs font-semibold block">
                                    {formattedDate}
                                </span>
                            )}

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary-900 leading-snug drop-shadow-sm">
                                {artTitle}
                            </h2>

                            {artExcerpt && (
                                <p className="text-primary-700 text-xs sm:text-sm leading-relaxed font-normal line-clamp-3">
                                    {artExcerpt}
                                </p>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {artSlug && (
                                <Link
                                    href={route('articles.show', artSlug)}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-500 text-primary-900 hover:bg-accent-400 font-bold text-xs shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    <span>Baca Artikel</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-primary-900 font-bold text-xs border border-gray-300 transition"
                            >
                                <Eye className="h-4 w-4 text-primary-600" />
                                <span>Lihat Produk</span>
                            </Link>
                        </div>

                        {/* Slider Controls */}
                        {count > 1 && (
                            <div className="pt-4 border-t border-gray-300 flex items-center justify-between">
                                {/* Dot indicators */}
                                <div className="flex items-center gap-1.5">
                                    {validArticles.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                idx === currentIndex
                                                    ? 'w-6 bg-accent-500'
                                                    : 'w-2 bg-gray-400 hover:bg-accent-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                                {/* Prev/Next */}
                                <div className="flex items-center gap-2 text-primary-600 text-xs">
                                    <span>{currentIndex + 1} / {count}</span>
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            type="button"
                                            onClick={prevSlide}
                                            className="p-2 rounded-lg bg-white hover:bg-accent-500 hover:text-primary-900 transition"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextSlide}
                                            className="p-2 rounded-lg bg-white hover:bg-accent-500 hover:text-primary-900 transition"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Kolom Gambar ─────────────────────────────── */}
                    <div className="lg:col-span-7 relative h-[280px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-inner order-1 lg:order-2">
                        {validArticles.map((art, idx) => {
                            const img   = art?.image;
                            const bgUrl = img && (img.startsWith('http') || img.startsWith('/'))
                                ? img
                                : img ? `/storage/${img}` : DEFAULT_HERO_IMG;
                            const isActive = idx === currentIndex;

                            return (
                                <div
                                    key={art.id ?? idx}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                    }`}
                                >
                                    <img
                                        src={bgUrl}
                                        alt={art.title}
                                        className={`w-full h-full object-cover object-center transition-transform duration-5000 ease-out ${
                                            isActive ? 'scale-105' : 'scale-100'
                                        }`}
                                    />
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
