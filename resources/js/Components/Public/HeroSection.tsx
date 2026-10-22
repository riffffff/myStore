import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Article } from '@/types/store';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react';
import { safeArray, formatDate } from '@/lib/utils';
import Button from '@/Components/Button';

const DEFAULT_HERO_IMG = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600';
const SLIDE_DURATION = 5000;

interface HeroSectionProps {
    articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
    const validArticles = safeArray(articles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const count = validArticles.length;

    useEffect(() => {
        if (count <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % count);
        }, SLIDE_DURATION);
        return () => clearInterval(interval);
    }, [count, currentIndex]);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd,   setTouchEnd]   = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove  = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd   = () => {
        if (!touchStart || !touchEnd) return;
        const d = touchStart - touchEnd;
        if (d > 45) nextSlide();
        else if (d < -45) prevSlide();
    };

    if (count === 0) return null;

    const current = validArticles[currentIndex];
    const artTitle = current?.title ?? '';
    const artSlug  = current?.slug ?? '';
    const artExcerpt = current?.excerpt ?? '';
    const formattedDate = formatDate(current?.published_at ?? '');

    const prevSlide = () => setCurrentIndex((p) => (p - 1 + count) % count);
    const nextSlide = () => setCurrentIndex((p) => (p + 1) % count);

    const getImgUrl = (art: Article) => {
        const img = art?.image;
        return img && (img.startsWith('http') || img.startsWith('/')) ? img : img ? `/storage/${img}` : DEFAULT_HERO_IMG;
    };

    return (
        <section className="w-full max-w-[1440px] mx-auto">

            {/* ══════════ MOBILE — Gambar Menyatu dengan Judul & Deskripsi ══════════ */}
            <div className="md:hidden px-3 pt-2 pb-3 w-full">
                <div
                    className="relative w-full overflow-hidden rounded-[28px] border border-white/10 shadow-2xl select-none h-[410px] sm:h-[440px] flex flex-col justify-between"
                    style={{
                        background: 'color-mix(in srgb, var(--color-header-bg, #0B132B) 90%, black)',
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* ── Background Image Slides ── */}
                    {validArticles.map((art, idx) => (
                        <div
                            key={art.id ?? idx}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
                            }`}
                        >
                            <img
                                src={getImgUrl(art)}
                                alt={art.title ?? ''}
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Dark gradient overlay agar teks terbaca sangat jelas */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />
                        </div>
                    ))}

                    {/* ── Top Header: Story Bars, Date & Slide Counter ── */}
                    <div className="relative z-20 pt-3.5 px-4 space-y-2.5">
                        {count > 1 && (
                            <div className="flex gap-1.5">
                                {validArticles.map((_, i) => (
                                    <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: i === currentIndex ? '100%' : i < currentIndex ? '100%' : '0%',
                                                background: i === currentIndex
                                                    ? 'var(--header-active, #0D9488)'
                                                    : i < currentIndex ? 'rgba(255,255,255,0.6)' : 'transparent',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            {formattedDate ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-[11px] font-medium shadow-sm">
                                    <Calendar className="h-3 w-3 opacity-80" />
                                    <span>{formattedDate}</span>
                                </div>
                            ) : <div />}

                            {count > 1 && (
                                <span className="text-white/80 text-[11px] font-semibold tracking-widest font-mono drop-shadow">
                                    {String(currentIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                                </span>
                            )}
                        </div>
                    </div>


                    {/* ── Center/Bottom Content Overlay ── */}
                    <div className="relative z-20 flex flex-col items-center text-center px-4 pt-4 pb-5 mt-auto">
                        {/* Judul: Serif, Uppercase, Tracking */}
                        <h2
                            key={`t-${currentIndex}`}
                            className="text-white text-xl sm:text-2xl font-serif font-bold uppercase tracking-[0.16em] leading-snug drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 line-clamp-2"
                        >
                            {artTitle}
                        </h2>

                        {/* Garis Aksen Horizontal */}
                        <div
                            className="w-10 h-1 rounded-full my-2.5 shadow-sm"
                            style={{ background: 'var(--header-active, #0D9488)' }}
                        />

                        {/* Deskripsi / Excerpt */}
                        {artExcerpt && (
                            <p
                                key={`e-${currentIndex}`}
                                className="text-white/80 text-xs leading-relaxed max-w-xs line-clamp-2 mb-4 drop-shadow animate-in fade-in slide-in-from-bottom-3 duration-400"
                            >
                                {artExcerpt}
                            </p>
                        )}

                        {/* Tombol Aksi Berdampingan */}
                        <div className="flex items-center justify-center gap-2.5 w-full max-w-xs">
                            {artSlug ? (
                                <Button
                                    href={route('articles.show', artSlug)}
                                    variant="primary"
                                    size="sm"
                                    className="flex-1 uppercase tracking-wider font-bold"
                                    rightIcon={<ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />}
                                >
                                    Selengkapnya
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>


            {/* ══════════ DESKTOP ══════════ */}
            <div className="hidden md:block py-6 px-6 lg:px-8">
                <div
                    className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F5] to-[#E9ECEF] p-8 lg:p-10 shadow-xl"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-800/5 blur-3xl" />

                    <div className="relative z-10 grid grid-cols-12 gap-8 lg:gap-10 items-center">
                        <div className="col-span-5 flex flex-col justify-between space-y-6 text-primary-900">
                            <div className="space-y-4">
                                {formattedDate && (
                                    <div className="flex items-center gap-1.5 text-primary-600 text-xs font-medium">
                                        <Calendar className="h-3.5 w-3.5 opacity-80" />
                                        <span>{formattedDate}</span>
                                    </div>
                                )}
                                <h2 key={`td-${currentIndex}`} className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {artTitle}
                                </h2>
                                {artExcerpt && (
                                    <p key={`ed-${currentIndex}`} className="text-primary-700 text-sm leading-relaxed line-clamp-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
                                        {artExcerpt}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {artSlug && (
                                    <Button
                                        href={route('articles.show', artSlug)}
                                        variant="primary"
                                        size="md"
                                        rightIcon={<ArrowRight className="h-4 w-4" />}
                                    >
                                        Baca
                                    </Button>
                                )}
                                <Button
                                    href={route('products.index')}
                                    variant="outline"
                                    size="md"
                                    leftIcon={<Eye className="h-4 w-4 text-primary-600" />}
                                >
                                    Lihat Produk
                                </Button>
                            </div>

                            {count > 1 && (
                                <div className="pt-4 border-t border-gray-200/80 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {validArticles.map((_, i) => (
                                            <button key={i} type="button" onClick={() => setCurrentIndex(i)}
                                                className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-accent-500' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="px-2 py-0.5 rounded-md bg-white/70 border border-gray-200 text-[11px]">{currentIndex + 1} / {count}</span>
                                        <div className="flex gap-1.5">
                                            <button onClick={prevSlide} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-accent-500 hover:text-white hover:border-transparent transition shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
                                            <button onClick={nextSlide} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-accent-500 hover:text-white hover:border-transparent transition shadow-sm"><ChevronRight className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-span-7 relative h-[320px] lg:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-white/60 select-none">
                            {validArticles.map((art, idx) => (
                                <div key={art.id ?? idx} className={`absolute inset-0 transition-opacity duration-700 ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                                    <img src={getImgUrl(art)} alt={art.title ?? ''} className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${idx === currentIndex ? 'scale-105' : 'scale-100'}`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
