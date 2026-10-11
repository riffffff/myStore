import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { PageProps } from '@/types';
import { PaymentMethod } from '@/types/store';
import { formatRupiah, getSafeShopSettings } from '@/lib/utils';
import {
    ShoppingBag,
    MapPin,
    Phone,
    User,
    CreditCard,
    QrCode,
    Upload,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Plus,
    Minus,
    Copy,
    Check,
    FileText,
    Loader2,
    ShieldCheck,
    Truck,
} from 'lucide-react';

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
    const shopName = safeSettings.shop_name ?? 'Toko Cookies';

    const [items, setItems] = useState<OrderItemInput[]>(
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

    // Update quantity
    const updateQuantity = (productId: number, delta: number) => {
        setItems((prev) => {
            const updated = prev
                .map((item) => {
                    if (item.product_id === productId) {
                        const newQty = Math.max(1, item.quantity + delta);
                        return { ...item, quantity: newQty };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0);

            form.setData(
                'items',
                updated.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
            );
            return updated;
        });
    };

    // Remove item
    const removeItem = (productId: number) => {
        setItems((prev) => {
            const updated = prev.filter((i) => i.product_id !== productId);
            form.setData(
                'items',
                updated.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
            );
            return updated;
        });
    };

    // Add extra product
    const addProduct = (productId: number) => {
        const found = allProducts.find((p) => p.id === productId);
        if (!found) return;

        setItems((prev) => {
            const exists = prev.find((i) => i.product_id === productId);
            let updated: OrderItemInput[];
            if (exists) {
                updated = prev.map((i) =>
                    i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                updated = [...prev, { product_id: found.id, quantity: 1, product: found }];
            }
            form.setData(
                'items',
                updated.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
            );
            return updated;
        });
    };

    // Hitung total harga & kuantitas
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Copy nominal transfer
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle file upload bukti bayar
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

    // Submit pesanan
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Pastikan items terbaru tersinkronisasi
        form.setData(
            'items',
            items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
        );

        form.post(route('orders.store'), {
            forceFormData: true,
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    // QRIS image fallback SVG jika belum diset admin
    const qrisDisplayUrl =
        shopSettings?.qris_image_url ||
        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126570011ID.CO.QRIS.WWW01189360099900000000015204581253033605802ID5910PAITECHSTORE6007JAKARTA6304ABCD';

    const qrisAccount = shopSettings?.qris_account_name || shopName;

    return (
        <PublicLayout>
            <Head title={`Pesan Produk - ${shopName}`} />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumbs */}
                <nav className="text-xs sm:text-sm text-stone-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
                    <Link href={route('home')} className="hover:text-amber-800 transition">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('cart.index')} className="hover:text-amber-800 transition">
                        Keranjang
                    </Link>
                    <span>/</span>
                    <span className="text-stone-900 font-bold">Pemesanan</span>
                </nav>

                {/* Page Title & Steps */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/80 pb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight flex items-center gap-2.5">
                            <ShoppingBag className="h-7 w-7 text-amber-900" />
                            Checkout & Pemesanan
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-stone-600">
                            Lengkapi data pengiriman dan pilih metode pembayaran untuk menyelesaikan pesanan Anda.
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                        <div className="flex items-center gap-1.5 text-accent-600">
                            <span className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>Pilih Produk</span>
                        </div>
                        <span className="text-stone-300">──</span>
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                            <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[10px]">2</span>
                            <span>Checkout</span>
                        </div>
                        <span className="text-stone-300">──</span>
                        <div className="flex items-center gap-1.5 text-stone-400">
                            <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-[10px]">3</span>
                            <span>Selesai</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* ================= KOLOM KIRI (DATA & PEMBAYARAN) ================= */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 1. DATA PENERIMA & ALAMAT */}
                            <ScrollReveal direction="up">
                                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
                                    <div className="flex items-center gap-2.5 text-stone-900 font-bold text-base border-b border-stone-100 pb-4 mb-5">
                                        <MapPin className="w-5 h-5 text-amber-900" />
                                        <h2>Data Penerima & Alamat Pengiriman</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Nama Lengkap */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                                Nama Lengkap <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.data.customer_name}
                                                    onChange={(e) => form.setData('customer_name', e.target.value)}
                                                    placeholder="Nama lengkap penerima"
                                                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                                />
                                            </div>
                                            {form.errors.customer_name && (
                                                <p className="mt-1 text-xs text-rose-600 font-medium">{form.errors.customer_name}</p>
                                            )}
                                        </div>

                                        {/* Nomor WhatsApp */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                                Nomor Handphone / WhatsApp <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={form.data.customer_phone}
                                                    onChange={(e) => form.setData('customer_phone', e.target.value)}
                                                    placeholder="08xxxxxxxxxx"
                                                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                                />
                                            </div>
                                            {form.errors.customer_phone && (
                                                <p className="mt-1 text-xs text-rose-600 font-medium">{form.errors.customer_phone}</p>
                                            )}
                                        </div>

                                        {/* Alamat Pengiriman */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                                Alamat Pengiriman Lengkap <span className="text-rose-500">*</span>
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={form.data.customer_address}
                                                onChange={(e) => form.setData('customer_address', e.target.value)}
                                                placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, patokan lokasi..."
                                                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition resize-none"
                                            />
                                            {form.errors.customer_address && (
                                                <p className="mt-1 text-xs text-rose-600 font-medium">{form.errors.customer_address}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* 2. METODE PEMBAYARAN */}
                            <ScrollReveal direction="up">
                                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
                                    <div className="flex items-center gap-2.5 text-stone-900 font-bold text-base border-b border-stone-100 pb-4 mb-5">
                                        <CreditCard className="w-5 h-5 text-amber-900" />
                                        <h2>Metode Pembayaran</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                        {/* Opsi COD */}
                                        <label
                                            className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                                                form.data.payment_method === 'cod'
                                                    ? 'border-amber-900 bg-amber-50/30 shadow-xs'
                                                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={form.data.payment_method === 'cod'}
                                                onChange={() => form.setData('payment_method', 'cod')}
                                                className="mt-1 text-amber-900 focus:ring-amber-900"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-amber-900" />
                                                    <span className="font-bold text-sm text-stone-900">
                                                        COD (Bayar di Tempat)
                                                    </span>
                                                </div>
                                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                                    Bayar tunai langsung saat pesanan tiba di alamat Anda.
                                                </p>
                                            </div>
                                        </label>

                                        {/* Opsi QRIS */}
                                        <label
                                            className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                                                form.data.payment_method === 'qris'
                                                    ? 'border-amber-900 bg-amber-50/30 shadow-xs'
                                                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="qris"
                                                checked={form.data.payment_method === 'qris'}
                                                onChange={() => form.setData('payment_method', 'qris')}
                                                className="mt-1 text-amber-900 focus:ring-amber-900"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <QrCode className="w-4 h-4 text-amber-900" />
                                                    <span className="font-bold text-sm text-stone-900">
                                                        QRIS (Transfer / Scan)
                                                    </span>
                                                </div>
                                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                                    BCA, Mandiri, BRI, GoPay, OVO, ShopeePay, DANA, dll.
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Panel Dinamis QRIS */}
                                    {form.data.payment_method === 'qris' ? (
                                        <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-5">
                                            <div className="text-center">
                                                <p className="text-xs font-semibold text-stone-600 mb-3">
                                                    Scan kode QRIS di bawah ini melalui aplikasi m-Banking atau e-Wallet Anda:
                                                </p>

                                                {/* QR Image */}
                                                <div className="inline-block p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                                                    <img
                                                        src={qrisDisplayUrl}
                                                        alt="QRIS Pembayaran"
                                                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg mx-auto"
                                                    />
                                                    <p className="text-xs font-bold text-stone-800 mt-2">
                                                        {qrisAccount}
                                                    </p>
                                                </div>

                                                {/* Total Nominal Transfer */}
                                                <div className="max-w-xs mx-auto mt-4 p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                                                    <div className="text-left">
                                                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Transfer</span>
                                                        <span className="text-base font-extrabold text-amber-950">
                                                            {formatRupiah(totalPrice)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(String(totalPrice))}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition"
                                                    >
                                                        {copied ? <Check className="w-3.5 h-3.5 text-accent-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                        <span>{copied ? 'Tersalin' : 'Salin'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Upload Bukti Pembayaran */}
                                            <div className="border-t border-stone-200 pt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                                                        <Upload className="w-4 h-4 text-amber-900" />
                                                        Bukti Pembayaran <span className="text-rose-600">* (Wajib)</span>
                                                    </label>
                                                    <span className="text-[11px] text-stone-500">Maks. 5MB (JPG, PNG)</span>
                                                </div>

                                                {proofPreview ? (
                                                    <div className="relative inline-block border-2 border-accent-500 rounded-xl p-1 bg-white shadow-xs">
                                                        <img
                                                            src={proofPreview}
                                                            alt="Pratinjau Bukti"
                                                            className="w-36 h-36 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveProof}
                                                            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition"
                                                            title="Ganti Bukti"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <p className="text-[10px] text-center font-bold text-accent-700 mt-1">
                                                            Bukti Terlampir ✓
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-xl bg-white cursor-pointer transition text-center group">
                                                        <Upload className="w-7 h-7 text-stone-400 group-hover:text-amber-900 transition mb-2" />
                                                        <span className="text-xs font-bold text-stone-800">
                                                            Klik untuk unggah screenshot bukti transfer
                                                        </span>
                                                        <span className="text-[11px] text-stone-400 mt-0.5">
                                                            Format JPG, PNG, atau WEBP
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}

                                                {form.errors.payment_proof && (
                                                    <p className="mt-2 text-xs text-rose-600 font-bold flex items-center gap-1">
                                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                        {form.errors.payment_proof}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Informasi COD */
                                        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                                            <ShieldCheck className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                                            <div className="text-xs text-stone-600 leading-relaxed">
                                                <span className="font-bold text-stone-900 block mb-0.5">
                                                    Pembayaran Tunai saat Pesanan Tiba
                                                </span>
                                                Siapkan uang pas sebesar <strong className="text-stone-900">{formatRupiah(totalPrice)}</strong> saat kurir mengantarkan pesanan Anda ke alamat tujuan.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* 3. CATATAN PESANAN (OPSIONAL) */}
                            <ScrollReveal direction="up">
                                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                                        <FileText className="w-4 h-4 text-stone-500" />
                                        Catatan untuk Penjual <span className="text-stone-400 font-normal lowercase">(opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        placeholder="Contoh: Titipkan di satpam / kirim sebelum jam 3 sore"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* ================= KOLOM KANAN (STICKY SIDEBAR RINGKASAN) ================= */}
                        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                            <ScrollReveal direction="up">
                                <div className="p-6 rounded-2xl border border-stone-200/80 bg-white shadow-xs">
                                    <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-950 flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-amber-900" />
                                            Ringkasan Pesanan
                                        </h3>
                                        <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                                            {items.length} Macam
                                        </span>
                                    </div>

                                    {/* List Produk */}
                                    {items.length === 0 ? (
                                        <div className="py-6 text-center text-xs text-stone-500">
                                            Belum ada produk yang dipilih.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
                                            {items.map((item) => (
                                                <div key={item.product_id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                                                    {/* Thumbnail */}
                                                    <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {item.product.image_url ? (
                                                            <img
                                                                src={item.product.image_url}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <ShoppingBag className="w-4 h-4 text-stone-400" />
                                                        )}
                                                    </div>

                                                    {/* Detail Nama & Qty */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-bold text-stone-900 truncate">
                                                            {item.product.name}
                                                        </h4>
                                                        <p className="text-[11px] text-stone-500">
                                                            {formatRupiah(item.product.price)}
                                                        </p>

                                                        {/* Counter kecil */}
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.product_id, -1)}
                                                                    className="px-1.5 py-0.5 hover:bg-stone-200 text-stone-600 transition"
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </button>
                                                                <span className="px-2 text-[11px] font-bold text-stone-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.product_id, 1)}
                                                                    className="px-1.5 py-0.5 hover:bg-stone-200 text-stone-600 transition"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.product_id)}
                                                                className="text-stone-400 hover:text-rose-600 transition p-0.5"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Subtotal Item */}
                                                    <div className="text-right shrink-0">
                                                        <span className="text-xs font-extrabold text-stone-900">
                                                            {formatRupiah(item.product.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {form.errors.items && (
                                        <p className="mt-2 text-xs text-rose-600 font-medium">{form.errors.items}</p>
                                    )}

                                    {/* Tambah Cookies Lainnya (Quick Add) */}
                                    {allProducts.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-stone-100">
                                            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                                                Tambah Cookies Lainnya:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                                                {allProducts.map((p) => {
                                                    const isSelected = items.some((i) => i.product_id === p.id);
                                                    return (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => addProduct(p.id)}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                                                                isSelected
                                                                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                                                                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                                            }`}
                                                        >
                                                            <Plus className="w-2.5 h-2.5 text-stone-500" />
                                                            <span>{p.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rincian Biaya */}
                                    <div className="pt-4 mt-4 border-t border-stone-100 space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-stone-600">
                                            <span>Total Item ({totalQty} pcs):</span>
                                            <span className="font-semibold text-stone-900">{formatRupiah(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-stone-600">
                                            <span>Pengantaran:</span>
                                            <span className="font-semibold text-accent-700">Gerobak Antar (Gratis)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-stone-600">
                                            <span>Metode Bayar:</span>
                                            <span className="font-bold uppercase text-stone-900">
                                                {form.data.payment_method === 'qris' ? 'QRIS' : 'COD'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-stone-950 pt-3 border-t border-stone-100">
                                            <span className="font-bold text-sm">Total Tagihan:</span>
                                            <span className="text-xl font-extrabold text-amber-950">
                                                {formatRupiah(totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tombol Pesan Sekarang */}
                                    <button
                                        type="submit"
                                        disabled={form.processing || items.length === 0}
                                        className="w-full mt-5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-900 to-amber-800 hover:from-amber-800 hover:to-amber-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {form.processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Memproses Pesanan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Pesan Sekarang ({formatRupiah(totalPrice)})</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-4 text-[11px] leading-relaxed text-stone-500 border-t border-stone-100 pt-3 flex items-center justify-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5 text-accent-600 shrink-0" />
                                        <span>Transaksi aman & langsung diproses toko.</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </aside>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
