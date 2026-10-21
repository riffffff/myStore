import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import { PaymentMethod } from '@/types/store';
import { formatRupiah, getSafeShopSettings } from '@/lib/utils';
import Button from '@/Components/Button';
import {
    ArrowLeft,
    QrCode,
    Truck,
    Upload,
    Trash2,
    Copy,
    Check,
    Download,
    ShieldCheck,
    AlertCircle,
    PackageCheck,
    MapPin,
} from 'lucide-react';
import MapAddressPickerModal from '@/Components/Public/MapAddressPickerModal';
import ScrollReveal from '@/Components/Public/ScrollReveal';

interface OrderItemInput {
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        stock_status: string;
        image_url: string | null;
    };
}

interface ProductOption {
    id: number;
    name: string;
    price: number;
    stock_status: string;
    image_url: string | null;
}

interface OrderCreateProps {
    initialItems: OrderItemInput[];
    allProducts: ProductOption[];
    customer: {
        name: string;
        phone: string;
        address: string;
    };
}

export default function Create({ initialItems, allProducts, customer }: OrderCreateProps) {
    const { shopSettings } = usePage<PageProps>().props;
    const safeSettings = getSafeShopSettings(shopSettings);
    const shopName = safeSettings.shop_name ?? 'Toko';

    const [items] = useState<OrderItemInput[]>(
        initialItems.length > 0
            ? initialItems
            : allProducts.length > 0
            ? [
                  {
                      product_id: allProducts[0].id,
                      quantity: 1,
                      product: allProducts[0],
                  },
              ]
            : []
    );

    const [copied, setCopied] = useState(false);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [isDownloadingQris, setIsDownloadingQris] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // Form Inertia
    const form = useForm<{
        customer_name: string;
        customer_phone: string;
        customer_address: string;
        payment_method: PaymentMethod;
        payment_proof: File | null;
        notes: string;
        items: Array<{ product_id: number; quantity: number }>;
    }>({
        customer_name: customer.name || '',
        customer_phone: customer.phone || '',
        customer_address: customer.address || '',
        payment_method: 'cod',
        payment_proof: null,
        notes: '',
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
    });

    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('payment_proof', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProof = () => {
        form.setData('payment_proof', null);
        setProofPreview(null);
    };

    const qrisDisplayUrl =
        shopSettings?.qris_image_url ||
        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126570011ID.CO.QRIS.WWW01189360099900000000015204581253033605802ID5910PAITECHSTORE6007JAKARTA6304ABCD';

    const qrisAccount = shopSettings?.qris_account_name || shopName;

    const handleDownloadQris = async () => {
        if (!qrisDisplayUrl) return;
        setIsDownloadingQris(true);
        try {
            const response = await fetch(qrisDisplayUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            const safeName = (qrisAccount || shopName || 'QRIS').replace(/[^a-zA-Z0-9_-]/g, '_');
            a.download = `QRIS-${safeName}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            const a = document.createElement('a');
            a.href = qrisDisplayUrl;
            a.target = '_blank';
            a.download = `QRIS-Pembayaran.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } finally {
            setTimeout(() => setIsDownloadingQris(false), 500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.transform((data) => ({
            ...data,
            items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        }));

        form.post(route('orders.store'), {
            forceFormData: true,
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    // Navbar Atas Simpel, Rapi & Presisi (Centered)
    const checkoutNavbar = (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 relative flex items-center justify-between">
                {/* Tombol Kembali Bersih */}
                <Link
                    href={route('cart.index')}
                    className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition active:scale-95"
                    title="Kembali ke Keranjang"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                {/* Judul Presisi di Tengah Layar */}
                <h1 className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-base font-bold text-stone-900 tracking-tight whitespace-nowrap">
                    Checkout
                </h1>

                {/* Spacer Kanan agar Simetris 100% */}
                <div className="w-9 h-9" aria-hidden="true" />
            </div>
        </header>
    );

    return (
        <PublicLayout customHeader={checkoutNavbar} hideBottomNav={true} hideFooter={true}>
            <Head title={`Checkout - ${shopName}`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 sm:pb-12">
                <ScrollReveal direction="up">
                    <form id="checkout-form" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* ================= KOLOM KIRI (BARANG DIBELI, ALAMAT, PEMBAYARAN) ================= */}
                        <div className="lg:col-span-7 xl:col-span-7 space-y-5">
                            
                            {/* ── 1. BARANG YANG DIBELI (TOKOPEDIA STYLE) ── */}
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3.5">
                                    <div className="flex items-center gap-2">
                                        <PackageCheck className="w-4 h-4 text-stone-700" />
                                        <h2 className="text-sm sm:text-base font-bold text-stone-900">
                                            Barang yang Dibeli
                                        </h2>
                                    </div>
                                    <span className="text-xs font-semibold text-stone-500">
                                        {totalQty} Barang
                                    </span>
                                </div>

                                <div className="divide-y divide-stone-100">
                                    {items.map((item) => (
                                        <div key={item.product_id} className="py-3 first:pt-0 last:pb-0 flex gap-3 sm:gap-4 items-center">
                                            {/* Foto Produk */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-100 border border-stone-200/70 overflow-hidden shrink-0">
                                                {item.product.image_url ? (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                        <PackageCheck className="w-5 h-5 text-stone-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Produk */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-snug">
                                                    {item.product.name}
                                                </h3>
                                                <div className="mt-1 flex items-baseline gap-2">
                                                    <span
                                                        className="text-xs sm:text-sm font-bold tracking-tight"
                                                        style={{ color: 'var(--price-color, #E63854)' }}
                                                    >
                                                        {formatRupiah(item.product.price)}
                                                    </span>
                                                    <span className="text-[11px] text-stone-400 font-medium">
                                                        × {item.quantity} barang
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Subtotal Item */}
                                            <div className="text-right shrink-0">
                                                <span className="text-xs sm:text-sm font-bold text-stone-900">
                                                    {formatRupiah(item.product.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── 2. DATA PENGIRIMAN (FORM SIMPEL + PILIH DI MAPS) ── */}
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                                    <h2 className="text-sm sm:text-base font-bold text-stone-900">
                                        Alamat Pengiriman
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsMapModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl transition shadow-2xs active:scale-95"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Pilih di Maps</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            required
                                            value={form.data.customer_name}
                                            onChange={(e) => form.setData('customer_name', e.target.value)}
                                            placeholder="Nama Penerima *"
                                            className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                                        />
                                        {form.errors.customer_name && (
                                            <p className="mt-1 text-xs text-rose-600">{form.errors.customer_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            required
                                            value={form.data.customer_phone}
                                            onChange={(e) => form.setData('customer_phone', e.target.value)}
                                            placeholder="Nomor HP / WhatsApp *"
                                            className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                                        />
                                        {form.errors.customer_phone && (
                                            <p className="mt-1 text-xs text-rose-600">{form.errors.customer_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <textarea
                                            required
                                            rows={2}
                                            value={form.data.customer_address}
                                            onChange={(e) => form.setData('customer_address', e.target.value)}
                                            placeholder="Alamat Lengkap (Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota, dsb) *"
                                            className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-[11px]">
                                        <button
                                            type="button"
                                            onClick={() => setIsMapModalOpen(true)}
                                            className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            <span>Pinpoint titik di peta (Tokopedia style)</span>
                                        </button>
                                        {form.errors.customer_address && (
                                            <span className="text-rose-600 font-medium">{form.errors.customer_address}</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        placeholder="Catatan untuk kurir/penjual (opsional)"
                                        className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
                                    />
                                </div>
                            </div>

                            {/* ── 3. METODE PEMBAYARAN ── */}
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                                <div className="border-b border-stone-100 pb-3">
                                    <h2 className="text-sm sm:text-base font-bold text-stone-900">
                                        Metode Pembayaran
                                    </h2>
                                </div>

                                {/* Opsi QRIS & COD Simpel: Hanya Logo & Judul */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* COD */}
                                    <label
                                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                                            form.data.payment_method === 'cod'
                                                ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 text-stone-950 font-bold'
                                                : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700 font-medium'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={form.data.payment_method === 'cod'}
                                            onChange={() => form.setData('payment_method', 'cod')}
                                            className="text-stone-900 focus:ring-stone-900 w-4 h-4"
                                        />
                                        <Truck className="w-4 h-4 text-stone-800 shrink-0" />
                                        <span className="text-xs sm:text-sm truncate">COD (Bayar di Tempat)</span>
                                    </label>

                                    {/* QRIS */}
                                    <label
                                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                                            form.data.payment_method === 'qris'
                                                ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 text-stone-950 font-bold'
                                                : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700 font-medium'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="qris"
                                            checked={form.data.payment_method === 'qris'}
                                            onChange={() => form.setData('payment_method', 'qris')}
                                            className="text-stone-900 focus:ring-stone-900 w-4 h-4"
                                        />
                                        <QrCode className="w-4 h-4 text-stone-800 shrink-0" />
                                        <span className="text-xs sm:text-sm truncate">QRIS</span>
                                    </label>
                                </div>

                                {/* Keterangan Pembayaran */}
                                {form.data.payment_method === 'cod' ? (
                                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>
                                            Bayar tunai sebesar{' '}
                                            <strong className="font-bold" style={{ color: 'var(--price-color, #E63854)' }}>
                                                {formatRupiah(totalPrice)}
                                            </strong>{' '}
                                            saat kurir tiba di alamat Anda.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3.5">
                                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between">
                                            <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs shrink-0 text-center">
                                                <img
                                                    src={qrisDisplayUrl}
                                                    alt="QRIS"
                                                    className="w-36 h-36 object-contain rounded-lg mx-auto"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleDownloadQris}
                                                    disabled={isDownloadingQris}
                                                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 hover:text-stone-900"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    <span>{isDownloadingQris ? 'Menyimpan...' : 'Simpan QRIS'}</span>
                                                </button>
                                            </div>

                                            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Penerima</span>
                                                    <p className="text-xs sm:text-sm font-bold text-stone-900">{qrisAccount}</p>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Nominal Bayar</span>
                                                        <span className="text-sm font-extrabold" style={{ color: 'var(--price-color, #E63854)' }}>
                                                            {formatRupiah(totalPrice)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(String(totalPrice))}
                                                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium"
                                                    >
                                                        {copied ? 'Tersalin ✓' : 'Salin'}
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-stone-500">
                                                    Scan melalui GoPay, OVO, Dana, ShopeePay, BCA, atau m-Banking.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Upload Bukti */}
                                        <div className="pt-3 border-t border-stone-200">
                                            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                                                Unggah Bukti Transfer <span className="text-rose-500">*</span>
                                            </label>
                                            {proofPreview ? (
                                                <div className="relative inline-block border border-stone-200 rounded-xl p-1 bg-white shadow-xs">
                                                    <img src={proofPreview} alt="Bukti" className="w-20 h-20 object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveProof}
                                                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 text-white shadow-xs"
                                                        title="Hapus Bukti"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-stone-300 hover:border-stone-500 rounded-xl bg-white cursor-pointer transition text-center group">
                                                    <Upload className="w-4 h-4 text-stone-400 group-hover:text-stone-700" />
                                                    <span className="text-xs font-medium text-stone-700">Pilih screenshot bukti bayar</span>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                            {form.errors.payment_proof && (
                                                <p className="mt-1 text-xs text-rose-600 font-medium">{form.errors.payment_proof}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── 4. RINGKASAN BELANJA DI MOBILE (TETAP TERLIHAT DI MOBILE) ── */}
                            <div className="lg:hidden bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
                                <h3 className="text-sm font-bold text-stone-900 mb-3 pb-2.5 border-b border-stone-100">
                                    Ringkasan Belanja
                                </h3>
                                <div className="space-y-2 text-xs text-stone-600">
                                    <div className="flex justify-between items-center">
                                        <span>Total Harga ({totalQty} Barang)</span>
                                        <span className="text-stone-900 font-medium">{formatRupiah(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Total Ongkos Kirim</span>
                                        <span className="text-emerald-600 font-semibold">Bebas Ongkir</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Biaya Layanan</span>
                                        <span className="text-stone-400 font-medium">Gratis</span>
                                    </div>
                                    <div className="pt-2.5 border-t border-stone-100 flex justify-between items-baseline">
                                        <span className="font-bold text-stone-900">Total Tagihan</span>
                                        <span className="text-base font-extrabold" style={{ color: 'var(--price-color, #E63854)' }}>
                                            {formatRupiah(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ================= KOLOM KANAN: RINGKASAN BELANJA DESKTOP (TOKOPEDIA STYLE) ================= */}
                        <div className="hidden lg:block lg:col-span-5 xl:col-span-5">
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24">
                                <h3 className="text-sm font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100">
                                    Ringkasan Belanja
                                </h3>

                                {/* Rincian Biaya Tokopedia */}
                                <div className="space-y-2.5 text-xs text-stone-600 pb-4 border-b border-stone-100">
                                    <div className="flex justify-between items-center">
                                        <span>Total Harga ({totalQty} Barang)</span>
                                        <span className="text-stone-900 font-medium">{formatRupiah(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Total Ongkos Kirim</span>
                                        <span className="text-emerald-600 font-semibold">Bebas Ongkir</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Biaya Jasa Aplikasi</span>
                                        <span className="text-stone-400 font-medium">Gratis</span>
                                    </div>
                                </div>

                                {/* Total Tagihan */}
                                <div className="py-4 flex justify-between items-baseline">
                                    <span className="text-sm font-bold text-stone-900">Total Tagihan</span>
                                    <span
                                        className="text-xl font-extrabold tracking-tight"
                                        style={{ color: 'var(--price-color, #E63854)' }}
                                    >
                                        {formatRupiah(totalPrice)}
                                    </span>
                                </div>

                                {/* Tombol Bayar */}
                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    variant="primary"
                                    size="lg"
                                    disabled={items.length === 0}
                                    isLoading={form.processing}
                                    loadingText="Memproses..."
                                    fullWidth
                                    className="h-12 text-sm font-semibold rounded-xl shadow-xs"
                                >
                                    Bayar Sekarang
                                </Button>

                                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Transaksi aman & terlindungi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                </ScrollReveal>
            </div>

            {/* ══════════ MOBILE STICKY BOTTOM BAR (ALA TOKOPEDIA MOBILE) ══════════ */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] py-3 px-4">
                <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
                    <div>
                        <span className="text-[11px] text-stone-400 font-medium block leading-tight">
                            Total Tagihan
                        </span>
                        <span
                            className="text-lg font-black tracking-tight leading-none"
                            style={{ color: 'var(--price-color, #E63854)' }}
                        >
                            {formatRupiah(totalPrice)}
                        </span>
                    </div>

                    <Button
                        type="submit"
                        form="checkout-form"
                        variant="primary"
                        size="md"
                        disabled={items.length === 0}
                        isLoading={form.processing}
                        loadingText="Memproses..."
                        className="px-6 h-11 text-xs font-semibold rounded-xl shadow-xs"
                    >
                        Bayar Sekarang
                    </Button>
                </div>
            </div>

            {/* ══════════ MODAL PILIH TITIK LOKASI DI MAPS (TOKOPEDIA PINPOINT) ══════════ */}
            <MapAddressPickerModal
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                onSelectAddress={(fullAddress) => {
                    form.setData('customer_address', fullAddress);
                }}
                initialAddress={form.data.customer_address}
            />
        </PublicLayout>
    );
}
