import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Check, ArrowLeft } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface ProductData {
    id: number;
    name: string;
    price: number;
    stock_status: string;
    category: string | null;
    description: string | null;
    is_published: boolean;
    cover: string | null;
}

interface Props {
    product: ProductData | null;
    categories: Category[];
}

export default function ProductForm({ product, categories }: Props) {
    const isEdit = !!product;
    const errors = (usePage().props as any).errors ?? {};

    const [name, setName] = useState(product?.name ?? '');
    const [price, setPrice] = useState(product?.price ? String(product.price) : '');
    const [stockStatus, setStockStatus] = useState(product?.stock_status ?? 'available');
    const [category, setCategory] = useState(product?.category ?? 'lainnya');
    const [description, setDescription] = useState(product?.description ?? '');
    const [isPublished, setIsPublished] = useState(product?.is_published ?? true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        product?.cover ? (product.cover.startsWith('http') || product.cover.startsWith('/') ? product.cover : `/storage/${product.cover}`) : null
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
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock_status', stockStatus);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('is_published', isPublished ? '1' : '0');
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (isEdit) {
            router.post(`/admin/produk/${product.id}`, formData, {
                forceFormData: true,
                onFinish: () => setLoading(false),
            });
        } else {
            router.post('/admin/produk', formData, {
                forceFormData: true,
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleDelete = () => {
        if (!product) return;
        if (confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
            router.delete(`/admin/produk/${product.id}`);
        }
    };

    return (
        <MobileAdminLayout title={isEdit ? 'Edit Produk' : 'Tambah Produk Baru'} backHref="/admin/produk">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* ── LEFT 2 COLS: Primary Product Information ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
                        <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                            Informasi Produk
                        </h2>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                Nama Produk *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Contoh: Kursi Tamu Minimalis Kayu Jati"
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition ${
                                    errors.name ? 'border-rose-400' : 'border-stone-200'
                                }`}
                            />
                            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Price & Category Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Price */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    Harga (Rp) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-xs">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        placeholder="0"
                                        className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition ${
                                            errors.price ? 'border-rose-400' : 'border-stone-200'
                                        }`}
                                    />
                                </div>
                                {errors.price && <p className="text-rose-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    Kategori
                                </label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                Deskripsi Produk
                            </label>
                            <textarea
                                rows={6}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Jelaskan spesifikasi, bahan, ukuran, dan keunggulan produk..."
                                className="w-full p-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-y"
                            />
                        </div>
                    </div>
                </div>

                {/* ── RIGHT 1 COL: Media & Publishing Controls ── */}
                <div className="space-y-6">
                    {/* Media Upload Card */}
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                        <label className="block text-xs font-bold text-stone-700 mb-2">
                            Foto Sampul Produk
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
                                        Klik untuk ganti foto
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center p-2">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-700">Unggah foto produk</span>
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

                    {/* Stock Status & Visibility Card */}
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                            Status & Publikasi
                        </h3>

                        {/* Stock Status */}
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                Ketersediaan Stok
                            </label>
                            <select
                                value={stockStatus}
                                onChange={e => setStockStatus(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            >
                                <option value="available">Tersedia (Ready Stock)</option>
                                <option value="preorder">Pre Order</option>
                                <option value="out_of_stock">Habis (Kosong)</option>
                            </select>
                        </div>

                        {/* Publish Switch */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                            <div>
                                <div className="text-xs font-bold text-stone-800">Status Publikasi</div>
                                <div className="text-[11px] text-stone-400">Tampilkan di toko publik</div>
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
                            {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Produk')}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full h-10 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus Produk Ini
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </MobileAdminLayout>
    );
}
