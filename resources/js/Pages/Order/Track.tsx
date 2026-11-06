import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { PageProps } from '@/types';
import { Order, OrderStatus } from '@/types/store';
import { formatRupiah, getSafeShopSettings, buildWhatsAppUrl } from '@/lib/utils';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import {
    Package,
    CheckCircle2,
    ChefHat,
    ArrowRight,
    MessageCircle,
    Clock,
    ShoppingBag,
    ChevronDown,
    Copy,
    Check,
    XCircle,
} from 'lucide-react';

interface OrderTrackProps {
    orders: Order[];
}

// Status tabs untuk filter interaktif ala e-commerce
const STATUS_TABS: Array<{
    id: string;
    keys: OrderStatus[];
    label: string;
    icon: React.ElementType;
}> = [
    { id: 'all',        keys: [],                                label: 'Semua',        icon: Package      },
    { id: 'pending',    keys: ['pending'],                       label: 'Menunggu',     icon: Clock        },
    { id: 'processing', keys: ['confirmed', 'processing'],       label: 'Disiapkan',    icon: ChefHat      },
    { id: 'shipped',    keys: ['shipped'],                       label: 'Pesanan Siap', icon: ShoppingBag  },
    { id: 'completed',  keys: ['completed'],                     label: 'Selesai',      icon: CheckCircle2 },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    pending:    { label: 'Menunggu',     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'   },
    confirmed:  { label: 'Dikonfirmasi', bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    dot: 'bg-teal-500'    },
    processing: { label: 'Diproses',     bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500'    },
    shipped:    { label: 'Dikirim',      bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  dot: 'bg-purple-500'  },
    completed:  { label: 'Selesai',      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    cancelled:  { label: 'Dibatalkan',   bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500'    },
};

export default function Track({ orders = [] }: OrderTrackProps) {
    const { shopSettings } = usePage<PageProps>().props;
    const safeSettings = getSafeShopSettings(shopSettings);
    const shopName = safeSettings.shop_name ?? 'Toko';
    const waNumber = safeSettings.whatsapp_number;

    const [activeTab, setActiveTab] = useState<string>('all');
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const toggleExpand = (id: number) =>
        setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Hitung jumlah per status
    const countByStatus = useMemo(() => {
        const counts: Partial<Record<OrderStatus, number>> = {};
        for (const order of orders) {
            counts[order.status] = (counts[order.status] ?? 0) + 1;
        }
        return counts;
    }, [orders]);

    // Tab yang tersedia (sertakan Dibatalkan jika ada pesanan batal)
    const availableTabs = useMemo(() => {
        const tabs = [...STATUS_TABS];
        if ((countByStatus['cancelled'] ?? 0) > 0) {
            tabs.push({ id: 'cancelled', keys: ['cancelled'], label: 'Dibatalkan', icon: XCircle });
        }
        return tabs;
    }, [countByStatus]);

    // Filter pesanan sesuai activeTab
    const filteredOrders = useMemo(() => {
        if (activeTab === 'all') return orders;
        const currentTab = availableTabs.find(t => t.id === activeTab);
        if (!currentTab) return orders;
        return orders.filter(order => currentTab.keys.includes(order.status));
    }, [orders, activeTab, availableTabs]);

    const activeTabLabel = availableTabs.find(t => t.id === activeTab)?.label ?? 'Status';

    return (
        <PublicLayout>
            <Head title={`Pesanan Saya - ${shopName}`} />

            {/* Page Header */}
            <div
                className="hidden sm:block py-16 sm:py-20 text-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)' }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Pesanan Saya</h1>
                    <p className="text-sm sm:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
                        Pantau status dan riwayat pesanan Anda dengan mudah.
                    </p>
                </div>
            </div>

            <div className="min-h-[calc(100vh-56px)] transition-colors">
                <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-16">

                    {orders.length === 0 ? (
                        <ScrollReveal direction="up" delay={80}>
                            <div
                                className="rounded-2xl border p-10 text-center shadow-xs"
                                style={{
                                    backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                }}
                            >
                                <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-7 h-7 text-primary-900 stroke-[1.5]" />
                                </div>
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Belum ada pesanan</h2>
                                <p className="text-xs text-gray-500 mb-5 max-w-xs mx-auto">
                                    Anda belum memiliki riwayat pesanan. Silakan jelajahi katalog untuk mulai berbelanja.
                                </p>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-white text-xs font-bold transition shadow-xs"
                                    style={{ backgroundColor: 'var(--color-primary-btn, var(--color-primary, #6E4F78))' }}
                                >
                                    <span>Mulai Belanja</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </ScrollReveal>
                    ) : (
                        <>
                            {/* ── Status Filter Tabs ── */}
                            <ScrollReveal direction="up" delay={60}>
                                <div
                                    className="rounded-2xl border shadow-2xs mb-4 p-1 sm:p-1.5"
                                    style={{
                                        backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                        borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                    }}
                                >
                                    <div className="flex items-stretch divide-x divide-gray-100/80">
                                        {availableTabs.map((tab) => {
                                            const count = tab.id === 'all'
                                                ? orders.length
                                                : tab.keys.reduce(
                                                    (acc, k) => acc + (countByStatus[k] ?? 0), 0
                                                );
                                            const Icon = tab.icon;
                                            const isActive = activeTab === tab.id;
                                            const hasCount = count > 0;

                                            return (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer relative select-none ${
                                                        isActive
                                                            ? 'shadow-xs font-bold'
                                                            : 'hover:bg-black/5 font-medium'
                                                    }`}
                                                    style={{
                                                        backgroundColor: isActive
                                                            ? 'color-mix(in srgb, var(--color-primary, #6E4F78) 12%, transparent)'
                                                            : 'transparent',
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <Icon
                                                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                                                                isActive
                                                                    ? 'scale-110 opacity-100'
                                                                    : hasCount
                                                                    ? 'opacity-85'
                                                                    : 'opacity-30'
                                                            }`}
                                                            style={{
                                                                color: (isActive || hasCount)
                                                                    ? 'var(--color-primary-btn, var(--color-primary, #6E4F78))'
                                                                    : undefined,
                                                            }}
                                                        />
                                                        {hasCount && (
                                                            <span
                                                                className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white shadow-2xs"
                                                                style={{ backgroundColor: 'var(--color-primary-btn, var(--color-primary, #6E4F78))' }}
                                                            >
                                                                {count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-[10px] sm:text-xs leading-tight text-center transition-colors ${
                                                            isActive
                                                                ? 'font-bold'
                                                                : hasCount
                                                                ? 'text-gray-700'
                                                                : 'text-gray-400'
                                                        }`}
                                                        style={{
                                                            color: isActive
                                                                ? 'var(--color-primary-btn, var(--color-primary, #6E4F78))'
                                                                : undefined,
                                                        }}
                                                    >
                                                        {tab.label}
                                                    </span>
                                                    {isActive && (
                                                        <span
                                                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                                                            style={{ backgroundColor: 'var(--color-primary-btn, var(--color-primary, #6E4F78))' }}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* ── Daftar Order (filtered) ── */}
                            {filteredOrders.length === 0 ? (
                                <div
                                    className="rounded-2xl border p-8 sm:p-10 text-center shadow-2xs"
                                    style={{
                                        backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                        borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-3">
                                        <Package className="w-6 h-6 text-gray-400 stroke-[1.5]" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                                        Tidak ada pesanan dengan status "{activeTabLabel}"
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                                        Saat ini tidak ada pesanan Anda yang berada pada status ini.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('all')}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold transition shadow-xs cursor-pointer hover:opacity-90"
                                        style={{ backgroundColor: 'var(--color-primary-btn, var(--color-primary, #6E4F78))' }}
                                    >
                                        <span>Tampilkan Semua Pesanan</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredOrders.map((order, orderIndex) => {
                                    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                                    const isExpanded = !!expandedIds[order.id];
                                    const waHelpUrl = buildWhatsAppUrl({
                                        phoneNumber: waNumber,
                                        message: `Halo Admin ${shopName}, saya ingin menanyakan status pesanan saya dengan nomor #${order.order_number}.`,
                                    });

                                    return (
                                        <ScrollReveal key={order.id} direction="up" delay={Math.min(orderIndex * 80, 400)}>
                                            <div
                                                className={`rounded-xl border shadow-2xs overflow-hidden transition-all duration-150 ${
                                                    order.status === 'cancelled'
                                                        ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
                                                        : 'hover:shadow-xs'
                                                }`}
                                                style={{
                                                    backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                                }}
                                            >

                                                {/* Card header — klik untuk expand */}
                                                <div
                                                    onClick={() => toggleExpand(order.id)}
                                                    className="p-3.5 sm:px-4 sm:py-3 cursor-pointer hover:bg-black/5 transition select-none"
                                                >
                                                    {/* Baris 1: No. Pesanan & Tanggal | Status Badge */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="font-mono font-bold text-xs text-gray-900 shrink-0">
                                                                #{order.order_number}
                                                            </span>
                                                            <span className="text-gray-300 text-xs">•</span>
                                                            <span className="text-[11px] text-gray-500 truncate">{order.created_at}</span>
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                            {cfg.label}
                                                        </span>
                                                    </div>

                                                    {/* Baris 2: Produk | Total & chevron */}
                                                    <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t border-gray-100">
                                                        <div className="text-xs text-gray-600 truncate min-w-0 font-medium">
                                                            {order.items.length === 1
                                                                ? order.items[0].product_name
                                                                : `${order.items[0]?.product_name ?? 'Pesanan'} (+${order.items.length - 1} item lainnya)`}
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-xs text-gray-500">Total:</span>
                                                            <span className="text-xs sm:text-sm font-extrabold" style={{ color: 'var(--price-color, #E63854)' }}>
                                                                {formatRupiah(order.total_price)}
                                                            </span>
                                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-gray-700' : ''}`} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detail expand */}
                                                {isExpanded && (
                                                    <div
                                                        className="border-t p-3.5 sm:p-4 space-y-3 text-xs"
                                                        style={{
                                                            backgroundColor: 'color-mix(in srgb, var(--color-bg, var(--page-bg, #FCF6E5)) 85%, var(--color-card-product-bg, #FFFDF7) 15%)',
                                                            borderColor: 'color-mix(in srgb, var(--color-card-product-border, #EBD9AC) 50%, transparent)',
                                                        }}
                                                    >
                                                        {/* Rincian item */}
                                                        <div>
                                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Rincian Item</div>
                                                            <div
                                                                className="rounded-lg border divide-y divide-gray-100"
                                                                style={{
                                                                    backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                                                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                                                }}
                                                            >
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="p-3 flex items-start justify-between gap-3">
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="font-semibold text-gray-900 leading-snug">{item.product_name}</p>
                                                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                                                {item.quantity} × {formatRupiah(item.unit_price)}
                                                                            </p>
                                                                        </div>
                                                                        <div className="text-right shrink-0 font-bold text-gray-900">
                                                                            {formatRupiah(item.subtotal_price)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Catatan */}
                                                        {order.notes && (
                                                            <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                                                <span className="font-bold">Catatan:</span> {order.notes}
                                                            </div>
                                                        )}

                                                        {/* Alamat */}
                                                        <div
                                                            className="rounded-lg border p-3 space-y-1"
                                                            style={{
                                                                backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                                                borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Alamat Pengiriman</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => copyToClipboard(`${order.customer_name} (${order.customer_phone}) - ${order.customer_address}`, `addr-${order.id}`)}
                                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 transition"
                                                                >
                                                                    {copiedId === `addr-${order.id}` ? (
                                                                        <><Check className="w-3 h-3 text-emerald-600" /><span className="text-emerald-600">Disalin!</span></>
                                                                    ) : (
                                                                        <><Copy className="w-3 h-3 text-teal-600" /><span>Salin</span></>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <p className="font-bold text-gray-900">
                                                                {order.customer_name} <span className="text-gray-500 font-normal">({order.customer_phone})</span>
                                                            </p>
                                                            <p className="text-gray-600 leading-relaxed text-[11px] sm:text-xs">{order.customer_address}</p>
                                                        </div>

                                                        {/* Pembayaran & Chat */}
                                                        <div className="flex items-center justify-between pt-1">
                                                            <span className="text-gray-500 text-[11px]">
                                                                Metode Bayar: <strong className="text-gray-800 uppercase">{order.payment_method}</strong>
                                                            </span>
                                                            <a
                                                                href={waHelpUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                                                            >
                                                                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                                                                <span>Chat Toko</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollReveal>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
                </div>
            </div>
        </PublicLayout>
    );
}
