import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { PageProps } from '@/types';
import { Order, OrderStatus } from '@/types/store';
import { formatRupiah, getSafeShopSettings, buildWhatsAppUrl } from '@/lib/utils';
import {
    Package,
    CheckCircle2,
    ChefHat,
    XCircle,
    ArrowRight,
    MessageCircle,
    MapPin,
    Calendar,
    Clock,
    ShoppingBag,
} from 'lucide-react';

interface OrderTrackProps {
    orders: Order[];
}

// 4 status utama
const STATUS_STEPS: Array<{
    keys: OrderStatus[];
    label: string;
    description: string;
    icon: React.ElementType;
}> = [
    {
        keys: ['pending'],
        label: 'Menunggu Konfirmasi',
        description: 'Pesanan menunggu dikonfirmasi',
        icon: Clock,
    },
    {
        keys: ['confirmed', 'processing'],
        label: 'Disiapkan',
        description: 'Pesanan sedang dipersiapkan',
        icon: ChefHat,
    },
    {
        keys: ['shipped'],
        label: 'Pesanan Siap',
        description: 'Siap / dalam pengiriman',
        icon: ShoppingBag,
    },
    {
        keys: ['completed'],
        label: 'Pesanan Selesai',
        description: 'Pesanan telah diterima',
        icon: CheckCircle2,
    },
];

function getStatusStepIndex(status: OrderStatus): number {
    for (let i = 0; i < STATUS_STEPS.length; i++) {
        if ((STATUS_STEPS[i].keys as string[]).includes(status)) return i;
    }
    return -1;
}

export default function Track({ orders }: OrderTrackProps) {
    const { shopSettings } = usePage<PageProps>().props;
    const safeSettings = getSafeShopSettings(shopSettings);
    const shopName = safeSettings.shop_name ?? 'Toko';
    const waNumber = safeSettings.whatsapp_number;

    return (
        <PublicLayout>
            <Head title={`Pesanan Saya - ${shopName}`} />

            {/* Hero Banner — selaras halaman lain */}
            <div
                className="hidden sm:block py-16 sm:py-20 text-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)' }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        Pesanan Saya
                    </h1>
                    <p className="text-sm sm:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
                        Riwayat dan status terkini seluruh pesanan belanja Anda.
                    </p>
                </div>
            </div>

            <div className="min-h-screen bg-stone-50/60 pb-16 pt-4 sm:pt-10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hasil */}
                    {orders.length === 0 ? (
                        <ScrollReveal direction="none">
                            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 shadow-xs">
                                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-stone-800">
                                    Belum Ada Pesanan
                                </h3>
                                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                                    Anda belum memiliki riwayat pesanan. Silakan jelajahi katalog produk kami untuk mulai berbelanja.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition"
                                        style={{ backgroundColor: 'var(--color-primary-btn)' }}
                                    >
                                        <span>Belanja Sekarang</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    ) : (
                        <>
                            {/* Tracking Card — pesanan pertama (terbaru) */}
                            {(() => {
                                const order = orders[0];
                                const currentIndex = getStatusStepIndex(order.status);
                                const isCancelled = order.status === 'cancelled';
                                const waHelpUrl = buildWhatsAppUrl({
                                    phoneNumber: waNumber,
                                    message: `Halo Admin ${shopName}, saya ingin menanyakan status pesanan saya dengan nomor #${order.order_number}.`,
                                });

                                return (
                                    <ScrollReveal direction="up">
                                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 mb-10">

                                            {/* Header Kartu */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-4 mb-6">
                                                <div>
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                                                        Pesanan Terbaru
                                                    </span>
                                                    <span className="text-lg font-mono font-extrabold text-stone-900">
                                                        {order.order_number}
                                                    </span>
                                                    <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-stone-400" />
                                                        {order.created_at}
                                                    </p>
                                                </div>
                                                <div>
                                                    {isCancelled ? (
                                                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Dibatalkan
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                                                            style={{ backgroundColor: 'var(--color-primary-btn)' }}
                                                        >
                                                            {STATUS_STEPS[currentIndex]?.label ?? order.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Timeline 4 Step */}
                                            {!isCancelled && (
                                                <div className="mb-8 px-2">
                                                    <div className="relative">
                                                        <div className="absolute top-5 left-[12%] right-[12%] h-0.5 bg-stone-200 -z-0" />
                                                        <div
                                                            className="absolute top-5 left-[12%] h-0.5 -z-0 transition-all duration-700"
                                                            style={{
                                                                width: currentIndex >= 0
                                                                    ? `${(currentIndex / (STATUS_STEPS.length - 1)) * 76}%`
                                                                    : '0%',
                                                                backgroundColor: 'var(--color-primary-btn)',
                                                            }}
                                                        />
                                                        <div className="flex justify-between items-start relative z-10">
                                                            {STATUS_STEPS.map((step, idx) => {
                                                                const isDone = currentIndex >= 0 && idx <= currentIndex;
                                                                const isCurrent = idx === currentIndex;
                                                                const StepIcon = step.icon;
                                                                return (
                                                                    <div key={step.label} className="flex flex-col items-center text-center w-1/4 px-1">
                                                                        <div
                                                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
                                                                                isCurrent
                                                                                    ? 'text-white ring-4 ring-offset-1 ring-amber-100'
                                                                                    : isDone
                                                                                    ? 'text-white'
                                                                                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                                                                            }`}
                                                                            style={isDone ? { backgroundColor: 'var(--color-primary-btn)' } : {}}
                                                                        >
                                                                            <StepIcon className="w-4 h-4" />
                                                                        </div>
                                                                        <span className={`text-[10px] sm:text-[11px] font-semibold mt-2 leading-tight ${isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                                                                            {step.label}
                                                                        </span>
                                                                        <span className="hidden sm:block text-[9px] text-stone-400 mt-0.5 leading-tight">
                                                                            {step.description}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rincian Singkat */}
                                            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 mb-5 text-xs">
                                                <div className="flex items-center justify-between font-semibold text-stone-700 mb-2">
                                                    <span>{order.customer_name} ({order.customer_phone})</span>
                                                    <span className="uppercase text-[10px] px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-stone-500 font-bold">
                                                        {order.payment_method}
                                                    </span>
                                                </div>
                                                <p className="text-stone-500 flex items-start gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                                    <span>{order.customer_address}</span>
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-stone-200">
                                                    {/* Daftar produk */}
                                                    <div className="space-y-1 mb-3">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between text-stone-600">
                                                                <span className="truncate mr-2">{item.product_name}</span>
                                                                <span className="shrink-0 text-stone-400">{item.quantity} pcs</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Total */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                                                        <span className="text-stone-400">{order.items.reduce((s, i) => s + i.quantity, 0)} pcs total</span>
                                                        <div className="text-right">
                                                            <span className="text-[10px] text-stone-400 uppercase block">Total</span>
                                                            <span className="text-sm font-extrabold text-stone-900">{formatRupiah(order.total_price)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi */}
                                            <div className="flex items-center justify-between pt-1">
                                                <Link
                                                    href={route('orders.success', order.order_number)}
                                                    className="text-xs font-bold hover:opacity-70 transition flex items-center gap-1"
                                                    style={{ color: 'var(--color-primary-btn)' }}
                                                >
                                                    <span>Lihat Detail Lengkap</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                                <a
                                                    href={waHelpUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-50 hover:bg-accent-100 text-accent-800 text-xs font-bold border border-accent-200 transition"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5 text-accent-600" />
                                                    <span>Hubungi Admin</span>
                                                </a>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                );
                            })()}

                            {/* Riwayat Pesanan — hanya status completed */}
                            {(() => {
                                const completedOrders = orders.filter(o => o.status === 'completed');
                                return (
                                    <ScrollReveal direction="up">
                                        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
                                            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                                                <h2 className="text-sm font-bold text-stone-800">Riwayat Pembelian</h2>
                                                {completedOrders.length > 0 && (
                                                    <span className="text-xs text-stone-400">{completedOrders.length} transaksi selesai</span>
                                                )}
                                            </div>

                                            {completedOrders.length === 0 ? (
                                                <div className="px-5 py-10 text-center">
                                                    <ShoppingBag className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                                                    <p className="text-xs text-stone-400 font-medium">Belum ada riwayat pembelian</p>
                                                    <p className="text-[11px] text-stone-300 mt-0.5">Pesanan yang sudah selesai akan muncul di sini</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-stone-100">
                                                    {completedOrders.map((o) => {
                                                        const productNames = o.items.map(i => i.product_name).filter(Boolean);
                                                        const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                                                        return (
                                                            <div key={o.id} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition text-xs">
                                                                {/* Info Produk */}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-stone-800 truncate leading-snug">
                                                                        {productNames.length > 0
                                                                            ? productNames.slice(0, 2).join(', ') + (productNames.length > 2 ? ` +${productNames.length - 2} lainnya` : '')
                                                                            : o.order_number}
                                                                    </p>
                                                                    <p className="text-stone-400 mt-0.5">{o.created_at} &middot; {totalQty} pcs</p>
                                                                </div>

                                                                {/* Total */}
                                                                <div className="text-right shrink-0 hidden sm:block">
                                                                    <p className="font-bold text-stone-800">{formatRupiah(o.total_price)}</p>
                                                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 font-semibold text-[10px]">
                                                                        Selesai
                                                                    </span>
                                                                </div>

                                                                <Link
                                                                    href={route('orders.success', o.order_number)}
                                                                    className="shrink-0 p-1.5 rounded-lg hover:bg-stone-100 transition"
                                                                    style={{ color: 'var(--color-primary-btn)' }}
                                                                    title="Lihat Detail"
                                                                >
                                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                                </Link>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </ScrollReveal>
                                );
                            })()}
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
