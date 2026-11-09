import AdminLayout from '@/Layouts/AdminLayout';
import { usePage, useForm } from '@inertiajs/react';
import { Store, QrCode, Image as ImageIcon, UploadCloud, Award, Shield, Zap, Truck, Star, Package, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { validateImageFile } from '@/lib/imageUpload';

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    zap: Zap,
    shield: Shield,
    truck: Truck,
    star: Star,
    package: Package,
};

interface StoreFeatureItem {
    title: string;
    description: string;
    icon?: string;
}

interface Settings {
    shop_name: string;
    shop_tagline: string | null;
    shop_phone: string | null;
    shop_email: string | null;
    shop_address: string | null;
    logo_url: string | null;
    qris_url: string | null;
    store_features?: StoreFeatureItem[];
}

interface ThemeProps {
    primary_color: string;
    accent_color: string;
    header_bg_color: string;
    header_active_color: string;
    hero_bg_color: string;
    hero_btn_color: string;
    page_bg_color?: string;
    font_family: string;
    border_radius: string;
}

interface Props {
    settings: Settings;
    theme?: ThemeProps;
}

const DEFAULT_FEATURES: StoreFeatureItem[] = [
    {
        title: 'Kualitas Terjamin',
        description: 'Produk dibuat dengan material pilihan berkualitas tinggi dan standar pengerjaan terbaik.',
        icon: 'zap',
    },
    {
        title: 'Transaksi Aman',
        description: 'Pilihan pembayaran mudah dan aman, didukung layanan pemesanan yang responsif.',
        icon: 'shield',
    },
    {
        title: 'Pengiriman Cepat',
        description: 'Pesanan Anda dikemas rapi dan dikirim dengan aman langsung ke alamat tujuan.',
        icon: 'truck',
    },
];

export default function SettingsPage({ settings, theme }: Props) {
    const flash = (usePage().props as any).flash ?? {};

    const initialFeatures = (settings.store_features && settings.store_features.length > 0)
        ? settings.store_features
        : DEFAULT_FEATURES;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        // Shop info
        shop_name:           settings.shop_name           ?? '',
        shop_tagline:        settings.shop_tagline        ?? '',
        shop_phone:          settings.shop_phone          ?? '',
        shop_email:          settings.shop_email          ?? '',
        shop_address:        settings.shop_address        ?? '',
        logo:                null as File | null,
        qris_image:          null as File | null,
        store_features:      initialFeatures,
    });

    const updateFeature = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
        setData('store_features', data.store_features.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const [logoError, setLogoError] = useState<string | null>(null);
    const [qrisError, setQrisError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [qrisPreview, setQrisPreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            if (qrisPreview) URL.revokeObjectURL(qrisPreview);
        };
    }, [logoPreview, qrisPreview]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const error = validateImageFile(file);
            if (error) {
                setLogoError(error);
                setData('logo', null);
                setLogoPreview(null);
                e.target.value = '';
                return;
            }
            setLogoError(null);
            clearErrors('logo');
            setData('logo', file);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleQrisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const error = validateImageFile(file);
            if (error) {
                setQrisError(error);
                setData('qris_image', null);
                setQrisPreview(null);
                e.target.value = '';
                return;
            }
            setQrisError(null);
            clearErrors('qris_image');
            setData('qris_image', file);
            if (qrisPreview) URL.revokeObjectURL(qrisPreview);
            setQrisPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pengaturan', { forceFormData: true });
    };

    return (
        <AdminLayout title="Pengaturan Toko">
            {flash.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2">
                    <span>✓</span>
                    <span>{flash.success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* ── LEFT 1 COL: Identitas Toko (Logo & QRIS) ── */}
                <div className="space-y-6">
                    <div
                        className="rounded-2xl border p-5 shadow-xs space-y-5"
                        style={{
                            backgroundColor: 'var(--color-admin-surface)',
                            borderColor: 'var(--color-admin-border)',
                        }}
                    >
                        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Identitas Toko
                        </h2>

                        {/* Logo Toko */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">
                                Logo Toko
                            </label>
                            <div className="relative border-2 border-dashed border-slate-200 hover:border-brand rounded-2xl p-4 bg-slate-50/70 hover:bg-brand-50/20 transition flex flex-col items-center justify-center min-h-35 overflow-hidden">
                                {(logoPreview || settings.logo_url) ? (
                                    <>
                                        <img
                                            src={logoPreview || settings.logo_url || ''}
                                            alt="Logo Toko"
                                            className="max-h-28 max-w-full object-contain"
                                        />
                                        {logoPreview && (
                                            <span className="absolute top-2 right-2 text-[10px] font-bold bg-white/90 text-brand-700 px-2 py-0.5 rounded-md shadow-xs">
                                                Baru
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-2 text-slate-400">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center mb-1.5">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">Belum ada logo</span>
                                        <span className="text-[11px] text-slate-400 mt-0.5">Pilih logo toko (maks. 3 MB)</span>
                                    </div>
                                )}
                            </div>
                            <label className="w-full h-10 rounded-xl bg-brand hover:bg-brand-600 text-brand-contrast text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                                <UploadCloud className="w-4 h-4" />
                                Ganti Logo
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                            </label>
                            <p className="text-[11px] text-slate-400 text-center">Format JPG, PNG, atau WebP (Maks. 3 MB)</p>
                            {(logoError || errors.logo) && (
                                <p className="text-rose-500 text-xs mt-1">{logoError || errors.logo}</p>
                            )}
                        </div>

                        {/* QRIS Pembayaran */}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-700">
                                QRIS Pembayaran
                            </label>
                            <div className="relative border-2 border-dashed border-slate-200 hover:border-brand rounded-2xl p-4 bg-slate-50/70 hover:bg-brand-50/20 transition flex flex-col items-center justify-center min-h-35 overflow-hidden">
                                {(qrisPreview || settings.qris_url) ? (
                                    <>
                                        <img
                                            src={qrisPreview || settings.qris_url || ''}
                                            alt="QRIS"
                                            className="max-h-28 max-w-full object-contain"
                                        />
                                        {qrisPreview && (
                                            <span className="absolute top-2 right-2 text-[10px] font-bold bg-white/90 text-brand-700 px-2 py-0.5 rounded-md shadow-xs">
                                                Baru
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-2 text-slate-400">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center mb-1.5">
                                            <QrCode className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">Belum ada QRIS</span>
                                        <span className="text-[11px] text-slate-400 mt-0.5">Pilih QRIS pembayaran (maks. 3 MB)</span>
                                    </div>
                                )}
                            </div>
                            <label className="w-full h-10 rounded-xl bg-brand hover:bg-brand-600 text-brand-contrast text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                                <UploadCloud className="w-4 h-4" />
                                Ganti QRIS
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleQrisChange}
                                />
                            </label>
                            <p className="text-[11px] text-slate-400 text-center">Format JPG, PNG, atau WebP (Maks. 3 MB)</p>
                            {(qrisError || errors.qris_image) && (
                                <p className="text-rose-500 text-xs mt-1">{qrisError || errors.qris_image}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT 2 COLS: Primary Store Information & Features ── */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Informasi & Kontak Toko */}
                        <div
                            className="rounded-2xl border p-5 sm:p-7 shadow-xs space-y-5"
                            style={{
                                backgroundColor: 'var(--color-admin-surface)',
                                borderColor: 'var(--color-admin-border)',
                            }}
                        >
                            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Informasi & Kontak Toko
                            </h2>

                            <div className="space-y-4">
                                {/* Nama Toko */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Nama Toko *
                                        </label>
                                        <span className={`text-[11px] tabular-nums ${data.shop_name.length >= 35 ? 'text-rose-500 font-bold' : data.shop_name.length >= 30 ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                                            {data.shop_name.length}/35
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength={35}
                                        value={data.shop_name}
                                        onChange={e => setData('shop_name', e.target.value)}
                                        placeholder="Contoh: Toko Keren"
                                        className={`w-full h-11 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition ${
                                            errors.shop_name ? 'border-rose-400' : 'border-slate-200'
                                        }`}
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Maksimal 35 karakter agar proporsional di header.</p>
                                    {errors.shop_name && <p className="text-rose-500 text-xs mt-1">{errors.shop_name}</p>}
                                </div>

                                {/* Slogan */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Slogan / Tagline Toko
                                    </label>
                                    <input
                                        type="text"
                                        value={data.shop_tagline}
                                        onChange={e => setData('shop_tagline', e.target.value)}
                                        placeholder="Contoh: Pilihan Terbaik Untuk Anda"
                                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                                    />
                                </div>

                                {/* WhatsApp & Email Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Nomor WhatsApp Toko
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.shop_phone}
                                            onChange={e => setData('shop_phone', e.target.value)}
                                            placeholder="08123456789"
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Email Toko
                                        </label>
                                        <input
                                            type="email"
                                            value={data.shop_email}
                                            onChange={e => setData('shop_email', e.target.value)}
                                            placeholder="info@toko.com"
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                                        />
                                    </div>
                                </div>

                                {/* Alamat */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Alamat Toko
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.shop_address}
                                        onChange={e => setData('shop_address', e.target.value)}
                                        placeholder="Alamat lengkap lokasi toko fisik..."
                                        className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition resize-y"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Keunggulan Toko */}
                        <div
                            className="rounded-2xl border p-5 sm:p-7 shadow-xs space-y-5"
                            style={{
                                backgroundColor: 'var(--color-admin-surface)',
                                borderColor: 'var(--color-admin-border)',
                            }}
                        >
                            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h2 className="text-base font-bold text-slate-900">
                                    Keunggulan Toko
                                </h2>
                                <span className="text-[11px] text-slate-400">
                                    Ditampilkan di beranda toko
                                </span>
                            </div>

                            <div className="space-y-4">
                                {data.store_features.map((feature, idx) => {
                                    const FeatureIcon = FEATURE_ICONS[feature.icon ?? 'zap'] || Zap;
                                    return (
                                        <div
                                            key={idx}
                                            className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3.5"
                                        >
                                            {/* Item Header */}
                                            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/60">
                                                <span className="w-6 h-6 rounded-md bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-xs font-bold text-slate-800">
                                                    Keunggulan #{idx + 1}
                                                </span>
                                            </div>

                                            {/* Fields */}
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {/* Pilihan Ikon */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                            Pilihan Ikon
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-brand shrink-0 shadow-2xs">
                                                                <FeatureIcon className="w-5 h-5" />
                                                            </div>
                                                            <select
                                                                value={feature.icon ?? 'zap'}
                                                                onChange={e => updateFeature(idx, 'icon', e.target.value)}
                                                                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand cursor-pointer"
                                                            >
                                                                <option value="zap">Kualitas (Zap)</option>
                                                                <option value="shield">Keamanan (Shield)</option>
                                                                <option value="truck">Pengiriman (Truck)</option>
                                                                <option value="star">Terbaik (Star)</option>
                                                                <option value="package">Kemasan / Paket (Package)</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Judul Keunggulan */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                            Judul Keunggulan *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            maxLength={60}
                                                            value={feature.title}
                                                            onChange={e => updateFeature(idx, 'title', e.target.value)}
                                                            placeholder="Contoh: Kualitas Terjamin"
                                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Deskripsi Singkat */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                        Deskripsi Singkat *
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        required
                                                        maxLength={255}
                                                        value={feature.description}
                                                        onChange={e => updateFeature(idx, 'description', e.target.value)}
                                                        placeholder="Contoh: Produk dibuat dengan material pilihan berkualitas tinggi dan standar pengerjaan terbaik."
                                                        className="w-full p-3.5 rounded-xl border border-slate-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition resize-y"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-brand hover:bg-brand-600 text-brand-contrast font-bold text-sm shadow-sm shadow-brand/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

