import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CartSummary, ShopSetting } from '@/types/store';
import {
    ShoppingCart, Minus, Plus, Trash2,
    ArrowRight, MessageCircle, ChevronRight,
} from 'lucide-react';
import { formatRupiah, getSafeShopSettings } from '@/lib/utils';
import Button from '@/Components/Button';
import ScrollReveal from '@/Components/Public/ScrollReveal';

interface CartIndexProps {
    cart: CartSummary;
    shopSettings?: ShopSetting;
}

export default function Index({ cart, shopSettings }: CartIndexProps) {
    const safeSettings = getSafeShopSettings(shopSettings);
    const waNumber = safeSettings.whatsapp_number;
    const shopName = safeSettings.shop_name ?? 'Toko';
    const items = Array.isArray(cart?.items) ? cart.items : [];
    const totalQty = cart?.total_quantity ?? 0;
    const totalPrice = cart?.total_price ?? 0;

    const updateItemQty = (itemId: number, newQty: number) => {
        router.post(
            route('cart.item.update', { cartItem: itemId }),
            { quantity: Math.max(1, newQty) },
            { preserveScroll: true, preserveState: true }
        );
    };

    const deleteItem = (itemId: number) => {
        router.delete(route('cart.item.destroy', { cartItem: itemId }), {
            preserveScroll: true,
        });
    };

    const buildWhatsAppAll = () => {
        if (items.length === 0) return `https://wa.me/${waNumber}`;
        let msg = `Halo ${shopName}, saya ingin memesan dari keranjang belanja:\n\n`;
        items.forEach((item, idx) => {
            msg += `${idx + 1}. ${item.product.name}\n`;
            msg += `   ${item.quantity} x ${formatRupiah(item.unit_price)} = ${formatRupiah(item.subtotal_price)}\n`;
        });
        msg += `\n*TOTAL: ${formatRupiah(totalPrice)}*\n`;
        msg += '\nMohon info ketersediaan stok & proses pemesanannya. Terima kasih!';
        return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    };

    return (
        <PublicLayout hideBottomNav={true} hideFooter={true}>
            <Head title={`Keranjang Belanja - ${shopName}`} />

            {/* ══ WRAPPER: full-screen, no footer ══ */}
            <div className="bg-[#F5F6F8] min-h-[calc(100vh-56px)] flex flex-col">


                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto pb-32 md:pb-8">

                    {/* ══ Unified Container: presisi sejajar dengan Header (px-4 sm:px-6 lg:px-8) ══ */}
                    <div className="max-w-2xl mx-auto md:max-w-6xl px-4 sm:px-6 lg:px-8 pt-4 pb-2">
                        <ScrollReveal direction="up">
                            {/* Breadcrumbs (Mobile & Desktop) */}
                            <nav className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 flex items-center gap-2" aria-label="Breadcrumb">
                            <Link href={route('home')} className="hover:text-gray-900 transition">
                                Beranda
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-bold">Keranjang</span>
                        </nav>

                        {items.length === 0 ? (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                                    <ShoppingCart className="w-8 h-8 text-gray-300 stroke-[1.5]" />
                                </div>
                                <h2 className="text-base font-semibold text-gray-900 mb-1.5">
                                    Keranjang masih kosong
                                </h2>
                                <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-xs">
                                    Yuk, temukan produk pilihan dan tambahkan ke keranjangmu!
                                </p>
                                <Button
                                    href={route('products.index')}
                                    variant="primary"
                                    size="md"
                                    className="rounded-full px-7 text-sm"
                                    rightIcon={<ArrowRight className="w-4 h-4" />}
                                >
                                    Mulai Belanja
                                </Button>
                            </div>
                        ) : (
                            <div className="md:grid md:grid-cols-12 md:gap-6 md:items-start">

                                {/* ── Item List ── */}
                                <div className="md:col-span-8 space-y-3">

                                    {/* Card Wrapper List Produk - presisi 100% rata kiri-kanan container */}
                                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs divide-y divide-gray-100 overflow-hidden">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 sm:p-5 flex gap-3.5 items-start hover:bg-gray-50/40 transition"
                                            >
                                                {/* Gambar Produk */}
                                                <Link
                                                    href={item.product.slug ? route('products.show', { slug: item.product.slug }) : route('products.index')}
                                                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 block"
                                                >
                                                    {item.product.image_url ? (
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingCart className="w-6 h-6 text-gray-300 stroke-[1.5]" />
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Detail & Controls */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                                                    <div>
                                                        {/* Nama Produk - konsisten dg ProductCard & Show */}
                                                        <Link
                                                            href={item.product.slug ? route('products.show', { slug: item.product.slug }) : route('products.index')}
                                                            className="text-xs sm:text-sm md:text-base font-bold text-gray-900 hover:text-accent-700 transition-colors line-clamp-2 leading-snug"
                                                        >
                                                            {item.product.name}
                                                        </Link>

                                                        {/* Harga Subtotal & Satuan */}
                                                        <div className="mt-1.5 flex items-baseline gap-2">
                                                            <span className="text-sm sm:text-base md:text-lg font-black tracking-tight" style={{ color: 'var(--price-color, #E63854)' }}>
                                                                {formatRupiah(item.subtotal_price)}
                                                            </span>
                                                            {item.quantity > 1 && (
                                                                <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                                                                    ({formatRupiah(item.unit_price)} / item)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Baris Bawah: Hapus & Stepper */}
                                                    <div className="flex items-center justify-between mt-3 pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteItem(item.id)}
                                                            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition py-1"
                                                            aria-label="Hapus item"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                                                            <span className="text-[11px] sm:text-xs">Hapus</span>
                                                        </button>

                                                        {/* Stepper Jumlah */}
                                                        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-gray-50/60">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemQty(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 disabled:hover:bg-transparent"
                                                                aria-label="Kurangi jumlah"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center font-bold text-gray-900 text-xs sm:text-sm select-none">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemQty(item.id, item.quantity + 1)}
                                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                                                                aria-label="Tambah jumlah"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Lanjut belanja */}
                                    <div className="pt-1">
                                        <Link
                                            href={route('products.index')}
                                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 transition"
                                        >
                                            <span>+ Tambah produk lain</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                            {/* ── Desktop Order Summary ── */}
                            <div className="hidden md:block md:col-span-4">
                                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sticky top-28">
                                    <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">Ringkasan Belanja</h2>

                                    <div className="space-y-2.5 text-xs text-gray-600 pb-4 border-b border-gray-100">
                                        <div className="flex justify-between">
                                            <span>Total Produk ({totalQty} item)</span>
                                            <span className="font-semibold" style={{ color: 'var(--price-color, #E63854)' }}>{formatRupiah(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Estimasi Ongkir</span>
                                            <span className="text-gray-400 italic">Dihitung saat checkout</span>
                                        </div>
                                    </div>

                                    <div className="py-4 flex justify-between items-baseline">
                                        <span className="text-xs text-gray-500">Total Tagihan</span>
                                        <span className="text-xl font-black" style={{ color: 'var(--price-color, #E63854)' }}>{formatRupiah(totalPrice)}</span>
                                    </div>

                                    <div className="space-y-2.5">
                                        <Button
                                            href={route('orders.create')}
                                            variant="primary"
                                            size="md"
                                            fullWidth
                                            className="h-11 text-sm font-semibold rounded-xl"
                                        >
                                            Checkout ({totalQty})
                                        </Button>
                                        <Button
                                            href={buildWhatsAppAll()}
                                            external
                                            variant="outline"
                                            size="md"
                                            fullWidth
                                            className="h-10 text-xs rounded-xl text-gray-600 border-gray-300"
                                        >
                                            Pesan via WhatsApp
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                        </ScrollReveal>
                    </div>
                </div>

                {/* ══ MOBILE FIXED BOTTOM BAR ══ */}
                {items.length > 0 && (
                    <div
                        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] px-3 py-2 flex items-center gap-2"
                        style={{ bottom: '-1px', paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
                    >
                        {/* 1. Chat — kiri (konsisten dg halaman produk) */}
                        <a
                            href={buildWhatsAppAll()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center w-12 h-11 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-gray-50 active:bg-gray-100 transition shrink-0"
                            aria-label="Chat Penjual"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-[10px] font-semibold tracking-tight mt-0.5">Chat</span>
                        </a>

                        {/* Divider */}
                        <div className="h-7 w-px bg-gray-200 shrink-0" />

                        {/* 2. Total harga */}
                        <div className="flex-1 min-w-0 px-1">
                            <span className="text-[11px] text-gray-500 block leading-tight">Total ({totalQty} item)</span>
                            <span className="text-base font-black leading-tight" style={{ color: 'var(--price-color, #E63854)' }}>
                                {formatRupiah(totalPrice)}
                            </span>
                        </div>

                        {/* 3. Tombol Checkout */}
                        <Button
                            href={route('orders.create')}
                            variant="primary"
                            size="md"
                            className="h-11 px-5 text-xs sm:text-sm font-bold shrink-0"
                        >
                            Checkout ({totalQty})
                        </Button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
