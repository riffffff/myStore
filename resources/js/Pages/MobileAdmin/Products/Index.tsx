import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Edit3, Eye, EyeOff } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock_status: string;
    is_published: boolean;
    category: string | null;
    cover: string | null;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    products: PaginatedProducts;
    search: string;
}

const fmt = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const stockLabel: Record<string, { label: string; bg: string; text: string }> = {
    available:    { label: 'Tersedia',  bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    preorder:     { label: 'Pre Order', bg: 'bg-amber-50 border-amber-200',     text: 'text-amber-700' },
    out_of_stock: { label: 'Kosong',    bg: 'bg-rose-50 border-rose-200',       text: 'text-rose-700' },
};

export default function ProductsIndex({ products, search: initialSearch }: Props) {
    const flash = (usePage().props as any).flash ?? {};
    const [search, setSearch] = useState(initialSearch);

    const doSearch = (q: string) => {
        setSearch(q);
        router.get('/admin/produk', { search: q }, { preserveState: true, replace: true });
    };

    const togglePublish = (id: number) => {
        router.post(`/admin/produk/${id}/publish`, {}, { preserveScroll: true });
    };

    return (
        <MobileAdminLayout title="Manajemen Produk">
            {/* Flash */}
            {flash.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2">
                    <span>✓</span>
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Header: Search + Add */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={e => doSearch(e.target.value)}
                        placeholder="Cari nama produk..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    />
                </div>
                <Link
                    href="/admin/produk/tambah"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm shadow-teal-600/30 transition shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                </Link>
            </div>

            {/* Empty State */}
            {products.data.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-400 text-sm">
                    Tidak ada produk ditemukan.
                </div>
            )}

            {/* ── DESKTOP TABLE VIEW (Visible on md+) ── */}
            {products.data.length > 0 && (
                <div className="hidden md:block bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                <th className="py-3.5 px-4 w-16">Foto</th>
                                <th className="py-3.5 px-4">Nama Produk</th>
                                <th className="py-3.5 px-4">Harga</th>
                                <th className="py-3.5 px-4">Stok</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm">
                            {products.data.map((p) => {
                                const stock = stockLabel[p.stock_status] ?? { label: p.stock_status, bg: 'bg-stone-50', text: 'text-stone-600' };
                                const coverUrl = p.cover ? (p.cover.startsWith('http') || p.cover.startsWith('/') ? p.cover : `/storage/${p.cover}`) : 'https://placehold.co/80x80/fafaf9/78716c?text=?';
                                return (
                                    <tr key={p.id} className="hover:bg-stone-50/60 transition group">
                                        <td className="py-3 px-4">
                                            <img
                                                src={coverUrl}
                                                alt={p.name}
                                                className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200/60"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                                            <div className="text-xs text-stone-400 capitalize mt-0.5">{p.category ? p.category.replace('_', ' ') : 'Lainnya'}</div>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-stone-800">
                                            {fmt(p.price)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border ${stock.bg} ${stock.text}`}>
                                                {stock.label}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => togglePublish(p.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                                    p.is_published
                                                        ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                                                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                                }`}
                                            >
                                                {p.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {p.is_published ? 'Terbit' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={`/admin/produk/${p.id}/edit`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── MOBILE CARDS VIEW (Visible on mobile: md:hidden) ── */}
            <div className="md:hidden flex flex-col gap-3">
                {products.data.map((p) => {
                    const stock = stockLabel[p.stock_status] ?? { label: p.stock_status, bg: 'bg-stone-50', text: 'text-stone-600' };
                    const coverUrl = p.cover ? (p.cover.startsWith('http') || p.cover.startsWith('/') ? p.cover : `/storage/${p.cover}`) : 'https://placehold.co/80x80/fafaf9/78716c?text=?';
                    return (
                        <div
                            key={p.id}
                            className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs flex items-center gap-3"
                        >
                            <img
                                src={coverUrl}
                                alt={p.name}
                                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-100"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="font-bold text-sm text-stone-900 truncate">{p.name}</div>
                                <div className="text-xs font-semibold text-stone-600 mt-0.5">{fmt(p.price)}</div>
                                <div className={`mt-1 text-[11px] font-semibold ${stock.text}`}>
                                    {stock.label}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <button
                                    onClick={() => togglePublish(p.id)}
                                    className={`w-10 h-6 rounded-full relative transition-colors ${
                                        p.is_published ? 'bg-teal-600' : 'bg-stone-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                            p.is_published ? 'left-[18px]' : 'left-0.5'
                                        }`}
                                    />
                                </button>
                                <Link
                                    href={`/admin/produk/${p.id}/edit`}
                                    className="p-1.5 rounded-lg bg-teal-50 text-teal-700"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {products.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
                    {products.prev_page_url ? (
                        <Link
                            href={products.prev_page_url}
                            className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                        >
                            ← Sebelumnya
                        </Link>
                    ) : <div />}

                    <span className="text-xs font-semibold text-stone-500">
                        Halaman {products.current_page} dari {products.last_page}
                    </span>

                    {products.next_page_url ? (
                        <Link
                            href={products.next_page_url}
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
