import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Edit3, Eye, EyeOff } from 'lucide-react';

interface Article {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    created_at: string;
    cover: string | null;
}

interface PaginatedArticles {
    data: Article[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    articles: PaginatedArticles;
    search: string;
}

export default function ArticlesIndex({ articles, search: initialSearch }: Props) {
    const flash = (usePage().props as any).flash ?? {};
    const [search, setSearch] = useState(initialSearch);

    const doSearch = (q: string) => {
        setSearch(q);
        router.get('/admin/artikel', { search: q }, { preserveState: true, replace: true });
    };

    const togglePublish = (id: number) => {
        router.post(`/admin/artikel/${id}/publish`, {}, { preserveScroll: true });
    };

    return (
        <MobileAdminLayout title="Manajemen Artikel">
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
                        placeholder="Cari judul artikel..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    />
                </div>
                <Link
                    href="/admin/artikel/tambah"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm shadow-teal-600/30 transition shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Tulis Artikel
                </Link>
            </div>

            {/* Empty State */}
            {articles.data.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-400 text-sm">
                    Tidak ada artikel ditemukan.
                </div>
            )}

            {/* ── DESKTOP TABLE VIEW (Visible on md+) ── */}
            {articles.data.length > 0 && (
                <div className="hidden md:block bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                <th className="py-3.5 px-4 w-16">Sampul</th>
                                <th className="py-3.5 px-4">Judul Artikel</th>
                                <th className="py-3.5 px-4">Tanggal Buat</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm">
                            {articles.data.map((a) => {
                                const coverUrl = a.cover ? (a.cover.startsWith('http') || a.cover.startsWith('/') ? a.cover : `/storage/${a.cover}`) : 'https://placehold.co/80x80/fafaf9/78716c?text=?';
                                return (
                                    <tr key={a.id} className="hover:bg-stone-50/60 transition group">
                                        <td className="py-3 px-4">
                                            <img
                                                src={coverUrl}
                                                alt={a.title}
                                                className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200/60"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-stone-900 line-clamp-1">{a.title}</div>
                                            <div className="text-xs text-stone-400 mt-0.5 font-mono">/{a.slug}</div>
                                        </td>
                                        <td className="py-3 px-4 text-xs font-medium text-stone-500">
                                            {a.created_at}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => togglePublish(a.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                                    a.is_published
                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                                }`}
                                            >
                                                {a.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {a.is_published ? 'Terbit' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={`/admin/artikel/${a.id}/edit`}
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
                {articles.data.map((a) => {
                    const coverUrl = a.cover ? (a.cover.startsWith('http') || a.cover.startsWith('/') ? a.cover : `/storage/${a.cover}`) : 'https://placehold.co/80x80/fafaf9/78716c?text=?';
                    return (
                        <div
                            key={a.id}
                            className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs flex items-center gap-3"
                        >
                            <img
                                src={coverUrl}
                                alt={a.title}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-100"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="font-bold text-sm text-stone-900 truncate">{a.title}</div>
                                <div className="text-xs text-stone-400 mt-0.5">{a.created_at}</div>
                                <div className="mt-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        a.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                                    }`}>
                                        {a.is_published ? '● Terbit' : '○ Draft'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <button
                                    onClick={() => togglePublish(a.id)}
                                    className={`w-10 h-6 rounded-full relative transition-colors ${
                                        a.is_published ? 'bg-teal-600' : 'bg-stone-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                            a.is_published ? 'left-[18px]' : 'left-0.5'
                                        }`}
                                    />
                                </button>
                                <Link
                                    href={`/admin/artikel/${a.id}/edit`}
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
            {articles.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
                    {articles.prev_page_url ? (
                        <Link
                            href={articles.prev_page_url}
                            className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                        >
                            ← Sebelumnya
                        </Link>
                    ) : <div />}

                    <span className="text-xs font-semibold text-stone-500">
                        Halaman {articles.current_page} dari {articles.last_page}
                    </span>

                    {articles.next_page_url ? (
                        <Link
                            href={articles.next_page_url}
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
