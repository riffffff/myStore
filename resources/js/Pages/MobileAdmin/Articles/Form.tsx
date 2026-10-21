import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { UploadCloud, Trash2, Check } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';

interface ArticleData {
    id: number;
    title: string;
    excerpt: string | null;
    content: string;
    is_published: boolean;
    is_hero: boolean;
    image: string | null;
}

interface Props {
    article: ArticleData | null;
}

export default function ArticleForm({ article }: Props) {
    const isEdit = !!article;
    const errors = (usePage().props as any).errors ?? {};

    const [title, setTitle] = useState(article?.title ?? '');
    const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
    const [content, setContent] = useState(article?.content ?? '');
    const [isPublished, setIsPublished] = useState(article?.is_published ?? true);
    const [isHero, setIsHero] = useState(article?.is_hero ?? false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        article?.image ? (article.image.startsWith('http') || article.image.startsWith('/') ? article.image : `/storage/${article.image}`) : null
    );
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('excerpt', excerpt);
        formData.append('content', content);
        formData.append('is_published', isPublished ? '1' : '0');
        formData.append('is_hero', isHero ? '1' : '0');
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (isEdit) {
            router.post(`/admin/artikel/${article.id}`, formData, {
                forceFormData: true,
                onFinish: () => setLoading(false),
            });
        } else {
            router.post('/admin/artikel', formData, {
                forceFormData: true,
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleDelete = () => {
        if (!article) return;
        if (confirm(`Yakin ingin menghapus artikel "${article.title}"?`)) {
            router.delete(`/admin/artikel/${article.id}`);
        }
    };

    return (
        <MobileAdminLayout title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'} backHref="/admin/artikel">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* ── LEFT 2 COLS: Article Content & Metadata ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
                        <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                            Konten Artikel
                        </h2>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                Judul Artikel *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Contoh: 7 Cara Mudah Merawat Furniture Kayu Agar Awet"
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition ${
                                    errors.title ? 'border-rose-400' : 'border-stone-200'
                                }`}
                            />
                            {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                Ringkasan Singkat (Excerpt)
                            </label>
                            <textarea
                                rows={2}
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                placeholder="Tuliskan 1-2 kalimat ringkasan yang menarik untuk preview kartu artikel..."
                                className="w-full p-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-y"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-stone-700">
                                    Isi Artikel Lengkap *
                                </label>
                                <span className="text-[11px] text-stone-400">
                                    Mendukung teks rata kiri-kanan (justify), tebal, miring, dsb.
                                </span>
                            </div>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                hasError={!!errors.content}
                                placeholder="Tuliskan artikel lengkap Anda di sini..."
                                minHeight="380px"
                            />
                            {errors.content && <p className="text-rose-500 text-xs mt-1.5">{errors.content}</p>}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT 1 COL: Cover Image & Publication ── */}
                <div className="space-y-6">
                    {/* Media Upload Card */}
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                        <label className="block text-xs font-bold text-stone-700 mb-2">
                            Gambar Sampul Artikel
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-stone-200 hover:border-teal-500/60 rounded-2xl p-4 bg-stone-50/70 hover:bg-teal-50/20 transition cursor-pointer flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden group"
                        >
                            {previewUrl ? (
                                <div className="flex flex-col items-center w-full">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-h-44 max-w-full rounded-xl object-contain shadow-xs"
                                    />
                                    <span className="mt-3 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full group-hover:bg-teal-100 transition">
                                        Klik untuk ganti sampul
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center p-2">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-700">Unggah gambar sampul</span>
                                    <span className="text-[11px] text-stone-400 mt-0.5">PNG, JPG, WebP max 5MB</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.image && <p className="text-rose-500 text-xs mt-1.5">{errors.image}</p>}
                    </div>

                    {/* Publish Status Card */}
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                            Pengaturan Terbit
                        </h3>

                        <div className="flex items-center justify-between pt-1">
                            <div>
                                <div className="text-xs font-bold text-stone-800">Publikasikan Artikel</div>
                                <div className="text-[11px] text-stone-400">Dapat dibaca langsung di blog toko</div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div>
                                    <div className="text-xs font-bold text-stone-800">Tampilkan sebagai Hero</div>
                                    <div className="text-[11px] text-stone-400">Artikel tampil di banner utama halaman depan</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsHero(!isHero)}
                                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                                        isHero ? 'bg-teal-600' : 'bg-stone-300'
                                    }`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                        isHero ? 'left-[22px]' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPublished(!isPublished)}
                                className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                                    isPublished ? 'bg-teal-600' : 'bg-stone-300'
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                        isPublished ? 'left-[22px]' : 'left-0.5'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <Check className="w-4 h-4" />
                            {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Terbitkan Artikel')}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full h-10 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus Artikel Ini
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </MobileAdminLayout>
    );
}
