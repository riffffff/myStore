import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ProductOption {
    id: number;
    name: string;
}

interface Review {
    id: number;
    product_id: number;
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
    products: ProductOption[];
}

const Stars = ({ rating }: { rating: number }) => (
    <span className="text-amber-500 text-sm">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
);

export default function ReviewsIndex({ reviews, filter, pendingCount, products = [] }: Props) {
    const flash = (usePage().props as any).flash ?? {};

    const [modalOpen, setModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_id: products[0]?.id ? String(products[0].id) : '',
        name: '',
        city: '',
        rating: 5,
        review: '',
        is_approved: true,
    });

    const openCreateModal = () => {
        setEditingReview(null);
        clearErrors();
        setData({
            product_id: products[0]?.id ? String(products[0].id) : '',
            name: '',
            city: '',
            rating: 5,
            review: '',
            is_approved: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (r: Review) => {
        setEditingReview(r);
        clearErrors();
        setData({
            product_id: r.product_id ? String(r.product_id) : (products[0]?.id ? String(products[0].id) : ''),
            name: r.name || r.author_name || '',
            city: r.city || '',
            rating: r.rating || 5,
            review: r.review || r.body || '',
            is_approved: Boolean(r.is_approved),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingReview(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const url = editingReview ? `/admin/ulasan/${editingReview.id}` : '/admin/ulasan';
        post(url, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

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
        <AdminLayout title="Ulasan">
            {flash.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2">
                    <span>✓</span>
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Header Bar: Filter Chips + Tambah Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {FILTERS.map(f => (
                        <Link
                            key={f.key}
                            href={`/admin/ulasan?filter=${f.key}`}
                            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition ${
                                filter === f.key
                                    ? 'bg-brand text-brand-contrast shadow-sm shadow-brand/30'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {f.label}
                        </Link>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand hover:bg-brand-600 text-brand-contrast text-xs font-bold shadow-sm shadow-brand/30 transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Ulasan</span>
                </button>
            </div>

            {/* Empty State */}
            {reviews.data.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 text-sm">
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
                                    ? 'border-slate-200/80'
                                    : 'border-amber-200 bg-amber-50/20 ring-1 ring-amber-200/50'
                            }`}
                        >
                            <div>
                                {/* Card Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 font-bold text-sm flex items-center justify-center shrink-0">
                                        {initial}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-sm text-slate-900 truncate">
                                                {authorName}
                                            </span>
                                            {r.city && (
                                                <span className="text-[11px] font-medium text-slate-400">
                                                    • {r.city}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Stars rating={r.rating} />
                                            <span className="text-[10px] text-slate-400 font-medium">{r.created_at}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Name */}
                                {r.product_name && (
                                    <div className="text-xs text-slate-500 font-medium truncate mb-2.5">
                                        {r.product_name}
                                    </div>
                                )}

                                {/* Review Text */}
                                {reviewText && (
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                                        {reviewText}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                                {!r.is_approved && (
                                    <button
                                        type="button"
                                        onClick={() => approve(r.id)}
                                        className="flex-1 h-9 rounded-xl bg-brand hover:bg-brand-600 text-brand-contrast text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <Check className="w-4 h-4" />
                                        Setujui
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => openEditModal(r)}
                                    className={`h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                        r.is_approved ? 'flex-1' : 'px-3'
                                    }`}
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => reject(r.id)}
                                    className={`h-9 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                        r.is_approved ? 'flex-1' : 'px-3'
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

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-base font-bold text-slate-900">
                                {editingReview ? 'Edit Ulasan Pelanggan' : 'Tambah Ulasan Pelanggan'}
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Produk <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    required
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                                >
                                    <option value="">-- Pilih Produk --</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="text-xs text-rose-600 mt-1">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Nama Pelanggan <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                                    />
                                    {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Kota
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Contoh: Jakarta"
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                                    />
                                    {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Rating <span className="text-rose-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className={`px-3 py-1.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                                                data.rating >= star
                                                    ? 'border-amber-300 bg-amber-50 text-amber-600'
                                                    : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
                                            }`}
                                        >
                                            ★ {star}
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && <p className="text-xs text-rose-600 mt-1">{errors.rating}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Isi Ulasan <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.review}
                                    onChange={(e) => setData('review', e.target.value)}
                                    placeholder="Minimal 10 karakter..."
                                    required
                                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                                />
                                {errors.review && <p className="text-xs text-rose-600 mt-1">{errors.review}</p>}
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_approved}
                                    onChange={(e) => setData('is_approved', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                                />
                                <span className="text-xs font-semibold text-slate-700">
                                    Tampilkan ulasan ini di halaman toko (Disetujui)
                                </span>
                            </label>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-600 text-brand-contrast text-xs font-bold shadow-sm shadow-brand/30 transition disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : editingReview ? 'Simpan Perubahan' : 'Simpan Ulasan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {reviews.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                    {reviews.prev_page_url ? (
                        <Link
                            href={reviews.prev_page_url}
                            className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                            ← Sebelumnya
                        </Link>
                    ) : <div />}

                    <span className="text-xs font-semibold text-slate-500">
                        Halaman {reviews.current_page} dari {reviews.last_page}
                    </span>

                    {reviews.next_page_url ? (
                        <Link
                            href={reviews.next_page_url}
                            className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Berikutnya →
                        </Link>
                    ) : <div />}
                </div>
            )}
        </AdminLayout>
    );
}
