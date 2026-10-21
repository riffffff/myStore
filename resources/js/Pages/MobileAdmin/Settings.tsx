import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { usePage, useForm } from '@inertiajs/react';
import { Store, QrCode, Image as ImageIcon, UploadCloud } from 'lucide-react';

interface Settings {
    shop_name: string;
    shop_tagline: string | null;
    shop_phone: string | null;
    shop_email: string | null;
    shop_address: string | null;
    logo_url: string | null;
    qris_url: string | null;
}

interface Props { settings: Settings; }

export default function SettingsPage({ settings }: Props) {
    const flash = (usePage().props as any).flash ?? {};

    const { data, setData, post, processing } = useForm({
        shop_name:    settings.shop_name    ?? '',
        shop_tagline: settings.shop_tagline ?? '',
        shop_phone:   settings.shop_phone   ?? '',
        shop_email:   settings.shop_email   ?? '',
        shop_address: settings.shop_address ?? '',
        logo: null as File | null,
        qris_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pengaturan', { forceFormData: true });
    };

    return (
        <MobileAdminLayout title="Pengaturan Toko">
            {flash.success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2">
                    <span>✓</span>
                    <span>{flash.success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Col: Shop Visual Previews */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
                            <Store className="w-4 h-4 text-teal-600" />
                            Identitas Toko
                        </h3>

                        {/* Logo Preview */}
                        <div className="mb-4">
                            <span className="text-xs font-bold text-stone-700 block mb-2">Logo Toko</span>
                            <div className="h-24 rounded-xl border border-stone-100 bg-stone-50 flex items-center justify-center p-3">
                                {settings.logo_url ? (
                                    <img src={settings.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <div className="text-stone-300 flex flex-col items-center gap-1">
                                        <ImageIcon className="w-6 h-6" />
                                        <span className="text-[10px]">Belum ada logo</span>
                                    </div>
                                )}
                            </div>
                            <label className="mt-2 flex items-center justify-center gap-2 h-9 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer">
                                <UploadCloud className="w-3.5 h-3.5" />
                                Ganti Logo
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={e => setData('logo', e.target.files?.[0] ?? null)} />
                            </label>
                        </div>

                        {/* QRIS Preview */}
                        <div>
                            <span className="text-xs font-bold text-stone-700 block mb-2">QRIS Pembayaran</span>
                            <div className="h-28 rounded-xl border border-stone-100 bg-stone-50 flex items-center justify-center p-3">
                                {settings.qris_url ? (
                                    <img src={settings.qris_url} alt="QRIS" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <div className="text-stone-300 flex flex-col items-center gap-1">
                                        <QrCode className="w-6 h-6" />
                                        <span className="text-[10px]">Belum ada QRIS</span>
                                    </div>
                                )}
                            </div>
                            <label className="mt-2 flex items-center justify-center gap-2 h-9 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer">
                                <UploadCloud className="w-3.5 h-3.5" />
                                Ganti QRIS
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={e => setData('qris_image', e.target.files?.[0] ?? null)} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right 2 Cols: Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
                        <div>
                            <h2 className="text-base font-bold text-stone-900">Informasi & Kontak Toko</h2>
                            <p className="text-xs text-stone-400 mt-0.5">Informasi ini akan ditampilkan ke pelanggan di header, footer, dan invoice</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    Nama Toko *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.shop_name}
                                    onChange={e => setData('shop_name', e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    Slogan / Tagline
                                </label>
                                <input
                                    type="text"
                                    value={data.shop_tagline}
                                    onChange={e => setData('shop_tagline', e.target.value)}
                                    placeholder="Contoh: Pusat Furniture Berkualitas & Bergaransi"
                                    className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                        Nomor WhatsApp Toko
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.shop_phone}
                                        onChange={e => setData('shop_phone', e.target.value)}
                                        placeholder="08123456789"
                                        className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                        Email Toko
                                    </label>
                                    <input
                                        type="email"
                                        value={data.shop_email}
                                        onChange={e => setData('shop_email', e.target.value)}
                                        placeholder="info@toko.com"
                                        className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                    Alamat Toko
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.shop_address}
                                    onChange={e => setData('shop_address', e.target.value)}
                                    placeholder="Alamat lengkap lokasi toko fisik / workshop..."
                                    className="w-full p-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-y"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm shadow-teal-600/30 transition disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MobileAdminLayout>
    );
}
