import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { CartSummary, ShopSetting } from '@/types/mebel';
import { ShoppingCart, Minus, Plus, Trash2, X, AlertTriangle, Info } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import WhatsAppButton from '@/Components/Public/WhatsAppButton';

interface CartIndexProps {
    cart: CartSummary;
    shopSettings: ShopSetting;
}

export default function Index({ cart, shopSettings }: CartIndexProps) {
    const { flash } = usePage().props as any;
    const waNumber = shopSettings?.whatsapp_number || '6281234567890';
    const items = Array.isArray(cart?.items) ? cart.items : [];
    const totalQty = cart?.total_quantity ?? 0;
    const totalPrice = cart?.total_price ?? 0;

    const updateItemQty = (itemId: number, newQty: number) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('cart.item.update', { cartItem: itemId });
        const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
        if (csrf) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = csrf;
            form.appendChild(tokenInput);
        }
        const qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = 'quantity';
        qtyInput.value = String(Math.max(1, newQty));
        form.appendChild(qtyInput);
        document.body.appendChild(form);
        form.submit();
    };

    const deleteItem = (itemId: number) => {
        (window as any).Inertia.delete(route('cart.item.destroy', { cartItem: itemId }));
    };

    const clearCart = () => {
        if (!window.confirm('Yakin ingin mengosongkan keranjang belanja?')) return;
        (window as any).Inertia.delete(route('cart.clear'));
    };

    const buildWhatsAppAll = () => {
        if (items.length === 0) return '';
        let msg = 'Halo, saya ingin memesan barang berikut dari keranjang saya:\n\n';
        items.forEach((item, idx) => {
            const n = idx + 1;
            msg += `${n}. ${item.product.name}\n`;
            msg += `   Jumlah: ${item.quantity} x ${formatRupiah(item.unit_price)}\n`;
            msg += `   Subtotal: ${formatRupiah(item.subtotal_price)}\n\n`;
        });
        msg += `---\n**TOTAL SELURUHNYA: ${formatRupiah(totalPrice)}**\n`;
        msg += '\nMohon bantuan proses pemesanannya. Terima kasih!';
        return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    };

    return (
        <PublicLayout>
            <Head title={`Keranjang Belanja | ${shopSettings?.shop_name || 'Agus Gerobak'}`} />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <nav className="text-xs sm:text-sm text-stone-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
                    <Link href={route('home')} className="hover:text-amber-900 transition">Beranda</Link>
                    <span>/</span>
                    <span className="text-stone-900 font-bold">Keranjang Belanja</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight flex items-center gap-2.5">
                            <ShoppingCart className="h-7 w-7 text-amber-900" />
                            Keranjang Belanja
                        </h1>
                        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
                            {totalQty === 0
                                ? 'Keranjang Anda masih kosong. Silakan pilih produk unggulan kami.'
                                : `Terdapat ${totalQty} item di keranjang belanja Anda.`}
                        </p>
                    </div>
                    {flash?.['cart.flash'] && (
                        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 max-w-md">
                            {flash['cart.flash']}
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <ScrollReveal direction="none">
                        <div className="py-16 text-center bg-white border border-stone-200/70 rounded-2xl shadow-xs">
                            <div className="mx-auto w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                                <ShoppingCart className="w-8 h-8" />
                            </div>
                            <h2 className="text-lg font-bold text-stone-900">Keranjang Masih Kosong</h2>
                            <p className="mt-1 text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
                                Belum ada produk di keranjang. Silakan jelajahi katalog furniture kayu jati kami.
                            </p>
                            <div className="mt-6 inline-flex items-center justify-center gap-3 flex-wrap">
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 shadow-xs transition"
                                >
                                    Lihat Katalog Produk
                                </Link>
                                <WhatsAppButton
                                    href={`https://wa.me/${waNumber}`}
                                    size="sm"
                                >
                                    Konsultasi via WhatsApp
                                </WhatsAppButton>
                            </div>
                        </div>
                    </ScrollReveal>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item, index) => (
                                <ScrollReveal key={item.id} delay={index * 100} direction="up">
                                    <div className="flex gap-4 p-4 bg-white border border-stone-200/70 rounded-2xl shadow-xs">
                                        <Link
                                            href={item.product.slug ? route('products.show', { slug: item.product.slug }) : route('products.index')}
                                            className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-200"
                                        >
                                            {item.product.image_url ? (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                    <ShoppingCart className="w-6 h-6" />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={item.product.slug ? route('products.show', { slug: item.product.slug }) : route('products.index')}
                                                        className="block font-bold text-stone-950 text-sm sm:text-base hover:text-amber-900 transition truncate"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <div className="mt-0.5 text-xs text-stone-500">
                                                        Harga:{' '}
                                                        <span className="font-semibold text-stone-700">
                                                            {formatRupiah(item.unit_price)}
                                                        </span>
                                                    </div>
                                                    {item.product.stock_status === 'out_of_stock' && (
                                                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            <span>Stok Habis</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteItem(item.id)}
                                                    title="Hapus dari keranjang"
                                                    className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="inline-flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateItemQty(item.id, item.quantity - 1)}
                                                        className="px-2.5 py-1.5 font-bold text-stone-600 hover:bg-stone-100 transition disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        min={1}
                                                        max={100}
                                                        onChange={(e) => {
                                                            const v = parseInt(e.target.value, 10);
                                                            if (!Number.isFinite(v) || v < 1) return;
                                                            updateItemQty(item.id, v);
                                                        }}
                                                        onBlur={(e) => {
                                                            const v = parseInt((e.target as HTMLInputElement).value, 10);
                                                            if (!Number.isFinite(v) || v < 1) {
                                                                (e.target as HTMLInputElement).value = String(item.quantity);
                                                            }
                                                        }}
                                                        className="w-14 px-1 py-1 text-center font-bold text-stone-900 text-xs border-x border-stone-300 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateItemQty(item.id, item.quantity + 1)}
                                                        className="px-2.5 py-1.5 font-bold text-stone-600 hover:bg-stone-100 transition"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                                                        Subtotal
                                                    </div>
                                                    <div className="text-base font-extrabold text-amber-950">
                                                        {formatRupiah(item.subtotal_price)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}

                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Kosongkan Keranjang
                                </button>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <ScrollReveal direction="right" className="sticky top-24">
                                <div className="p-6 rounded-2xl border border-stone-200/70 bg-white shadow-xs">
                                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-3">
                                        Ringkasan Belanja
                                    </h3>

                                    <div className="py-4 space-y-2.5 text-xs">
                                        <div className="flex justify-between items-center text-stone-600">
                                            <span>Total Barang:</span>
                                            <span className="font-bold text-stone-900">{totalQty} pcs</span>
                                        </div>
                                        <div className="flex justify-between items-center text-stone-600 pt-2 border-t border-stone-100">
                                            <span>Total Pembayaran:</span>
                                            <span className="text-lg font-extrabold text-amber-950">
                                                {formatRupiah(totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <WhatsAppButton
                                            href={buildWhatsAppAll()}
                                            fullWidth
                                        >
                                            Checkout via WhatsApp
                                        </WhatsAppButton>
                                        <Link
                                            href={route('products.index')}
                                            className="block w-full text-center px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                                        >
                                            Lanjut Belanja
                                        </Link>
                                    </div>

                                    <div className="mt-4 text-[11px] leading-relaxed text-stone-500 border-t border-stone-100 pt-3 flex items-start gap-1.5">
                                        <Info className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                                        <span>Pemesanan dilanjutkan via WhatsApp untuk konfirmasi pengiriman & detail produk.</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </aside>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
