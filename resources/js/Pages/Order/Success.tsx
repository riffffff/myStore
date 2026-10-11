import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { PageProps } from '@/types';
import { Order } from '@/types/store';
import { formatRupiah, getSafeShopSettings, buildWhatsAppUrl } from '@/lib/utils';
import {
    CheckCircle2,
    Copy,
    Check,
    ShoppingBag,
    ArrowLeft,
    MessageCircle,
    FileCheck,
    Clock,
} from 'lucide-react';

interface OrderSuccessProps {
    order: Order;
}

const STATUS_LABEL: Record<string, string> = {
    pending:    'Menunggu Konfirmasi',
    confirmed:  'Disiapkan',
    processing: 'Disiapkan',
    shipped:    'Pesanan Siap',
    completed:  'Pesanan Selesai',
    cancelled:  'Dibatalkan',
};

export default function Success({ order }: OrderSuccessProps) {
    const { shopSettings } = usePage<PageProps>().props;
    const safeSettings = getSafeShopSettings(shopSettings);
    const shopName = safeSettings.shop_name ?? 'Toko';
    const waNumber = safeSettings.whatsapp_number;

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(order.order_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const waUrl = buildWhatsAppUrl({
        phoneNumber: waNumber,
        message: `Halo Admin ${shopName}, saya ingin menanyakan pesanan #${order.order_number}.`,
    });

    return (
        <PublicLayout>
            <Head title={`Detail Pesanan #${order.order_number} - ${shopName}`} />

            {/* Hero Banner */}
            <div
                className="hidden sm:block py-16 sm:py-20 text-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)' }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        Detail Pesanan
                    </h1>
                    <p className="text-sm sm:text-base opacity-70 max-w-xl mx-auto font-mono">
                        {order.order_number}
                    </p>
                </div>
            </div>

            <div className="min-h-screen bg-stone-50/60 pb-16 pt-10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal direction="up">
                        {/* === SINGLE CARD === */}
                        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">

                            {/* Header: Nomor + Status + Salin */}
                            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-stone-100">
                                <div>
                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                                        Nomor Pesanan
                                    </span>
                                    <span className="font-mono font-extrabold text-stone-900 text-base leading-none">
                                        {order.order_number}
                                    </span>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                                        <span
                                            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                                            style={{ backgroundColor: order.status === 'cancelled' ? '#e11d48' : 'var(--color-primary-btn)' }}
                                        >
                                            {STATUS_LABEL[order.status] ?? order.status}
                                        </span>
                                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold uppercase">
                                            {order.payment_method === 'qris' ? 'QRIS' : 'COD'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-600 transition shrink-0"
                                >
                                    {copied ? (
                                        <><Check className="w-3.5 h-3.5 text-accent-600" /><span className="text-accent-700">Tersalin</span></>
                                    ) : (
                                        <><Copy className="w-3.5 h-3.5" /><span>Salin</span></>
                                    )}
                                </button>
                            </div>

                            {/* Produk Dipesan */}
                            <div className="px-6 py-4 border-b border-stone-100">
                                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    Produk Dipesan
                                </p>
                                <div className="divide-y divide-stone-100">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                                            <div className="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                {item.product?.image_url ? (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag className="w-4 h-4 text-stone-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-stone-900 truncate">{item.product_name}</p>
                                                <p className="text-xs text-stone-400 mt-0.5">{item.quantity} pcs &times; {formatRupiah(item.unit_price)}</p>
                                            </div>
                                            <span className="text-sm font-bold text-stone-800 shrink-0">
                                                {formatRupiah(item.subtotal_price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100">
                                <span className="text-sm font-bold text-stone-700">Total Pembayaran</span>
                                <span className="text-base font-extrabold text-stone-900">{formatRupiah(order.total_price)}</span>
                            </div>

                            {/* Bukti Pembayaran */}
                            {order.payment_proof_url && (
                                <div className="px-6 py-5 border-b border-stone-100">
                                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <FileCheck className="w-3.5 h-3.5 text-accent-600" />
                                        Bukti Pembayaran
                                    </p>
                                    <a
                                        href={order.payment_proof_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group relative w-36 h-36 rounded-xl overflow-hidden border border-stone-200"
                                    >
                                        <img
                                            src={order.payment_proof_url}
                                            alt="Bukti Transfer"
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[11px] text-white font-bold">
                                            Lihat Foto
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* Navigasi */}
                            <div className="px-6 py-4 flex items-center gap-3">
                                <Link
                                    href={route('orders.track', { search: order.order_number })}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs text-center transition flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Pesanan Saya</span>
                                </Link>
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-accent-50 hover:bg-accent-100 text-accent-800 font-bold text-xs text-center transition flex items-center justify-center gap-2 border border-accent-200"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 text-accent-600" />
                                    <span>Hubungi Admin</span>
                                </a>
                            </div>

                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </PublicLayout>
    );
}
