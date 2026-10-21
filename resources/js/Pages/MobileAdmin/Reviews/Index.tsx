import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { Check, Trash2 } from 'lucide-react';

interface Review {
    id: number;
    author_name?: string;
    name?: string;
    city?: string | null;
    rating: number;
    body?: string;
    review?: string;
    product_name?: string | null;
    is_approved: boolean;
    created_at: string;
}

interface PaginatedReviews {
    data: Review[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    reviews: PaginatedReviews;
    filter: string;
    pendingCount: number;
}

const Stars = ({ rating }: { rating: number }) => (
    <span className="text-amber-500 text-sm">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
);

export default function ReviewsIndex({ reviews, filter, pendingCount }: Props) {
    const flash = (usePage().props as any).flash ?? {};

    const approve = (id: number) => router.post(`/admin/ulasan/${id}/approve`, {}, { preserveScroll: true });
    const reject = (id: number) => {
        if (confirm('Hapus ulasan ini secara permanen?')) {
            router.delete(`/admin/ulasan/${id}`, { preserveScroll: true });
        }
    };

    const FILTERS = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: pendingCount > 0 ? `Pending (${pendingCount})` : 'Pending' },
        { key: 'approved', label: 'Disetujui' },
    ];

    return (
        <MobileAdminLayout title="Ulasan">
            {flash.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2">
                    <span>✓</span>
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Filter Chips */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {FILTERS.map(f => (
                    <Link
                        key={f.key}
                        href={`/admin/ulasan?filter=${f.key}`}
                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            filter === f.key
                                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        {f.label}
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {reviews.data.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-400 text-sm">
                    {filter === 'pending' ? 'Tidak ada ulasan pending.' : 'Belum ada ulasan.'}
                </div>
            )}

            {/* Responsive Grid of Review Cards (1 col on mobile, 2 cols on tablet, 3 cols on laptop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.data.map((r) => {
                    const authorName = r.name || r.author_name || 'Pelanggan';
                    const reviewText = r.review || r.body || '';
                    const initial = authorName ? authorName.charAt(0).toUpperCase() : 'U';

                    return (
                        <div
                            key={r.id}
                            className={`bg-white rounded-2xl p-5 border flex flex-col justify-between shadow-xs transition ${
                                r.is_approved
                                    ? 'border-stone-200/80'
                                    : 'border-amber-200 bg-amber-50/20 ring-1 ring-amber-200/50'
                            }`}
                        >
                            <div>
                                {/* Card Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0">
                                        {initial}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-sm text-stone-900 truncate">
                                                {authorName}
                                            </span>
                                            {r.city && (
                                                <span className="text-[11px] font-medium text-stone-400">
                                                    • {r.city}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Stars rating={r.rating} />
                                            <span className="text-[10px] text-stone-400 font-medium">{r.created_at}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Name */}
                                {r.product_name && (
                                    <div className="text-xs text-stone-500 font-medium truncate mb-2.5">
                                        {r.product_name}
                                    </div>
                                )}

                                {/* Review Text */}
                                {reviewText && (
                                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4 whitespace-pre-wrap">
                                        {reviewText}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                                {!r.is_approved && (
                                    <button
                                        onClick={() => approve(r.id)}
                                        className="flex-1 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <Check className="w-4 h-4" />
                                        Setujui
                                    </button>
                                )}
                                <button
                                    onClick={() => reject(r.id)}
                                    className={`h-9 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                        r.is_approved ? 'w-full' : 'px-3'
                                    }`}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{r.is_approved ? 'Hapus' : 'Tolak'}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {reviews.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
                    {reviews.prev_page_url ? (
                        <Link
                            href={reviews.prev_page_url}
                            className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                        >
                            ← Sebelumnya
                        </Link>
                    ) : <div />}

                    <span className="text-xs font-semibold text-stone-500">
                        Halaman {reviews.current_page} dari {reviews.last_page}
                    </span>

                    {reviews.next_page_url ? (
                        <Link
                            href={reviews.next_page_url}
                            className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                        >
                            Berikutnya →
                        </Link>
                    ) : <div />}
                </div>
            )}
        </MobileAdminLayout>
    );
}
