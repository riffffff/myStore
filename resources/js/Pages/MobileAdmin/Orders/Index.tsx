import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    ShoppingCart,
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    XCircle,
    Eye,
    QrCode,
    MessageCircle,
    Copy,
    Check,
    ChevronDown,
    MapPin,
    Phone,
    X,
    Trash2,
} from 'lucide-react';

/* ─────────────────────────── TYPES ─────────────────────────── */
interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal_price: number;
    image_url: string | null;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    payment_method: 'cod' | 'qris';
    payment_proof: string | null;
    payment_proof_url: string | null;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    total_price: number;
    notes: string | null;
    created_at: string;
    created_at_human: string;
    items_count: number;
    items: OrderItem[];
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    orders: PaginatedOrders;
    filters: {
        search: string;
        status: string;
        payment_method: string;
    };
    counts: Record<string, number>;
}

/* ─────────────────────── THEME CONSTANTS ─────────────────────── */
const STATUS_CONFIG: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string; icon: any }
> = {
    pending: {
        label: 'Menunggu',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        icon: Clock,
    },
    confirmed: {
        label: 'Dikonfirmasi',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        dot: 'bg-teal-500',
        icon: CheckCircle2,
    },
    processing: {
        label: 'Diproses',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        icon: PackageCheck,
    },
    shipped: {
        label: 'Dikirim',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        icon: Truck,
    },
    completed: {
        label: 'Selesai',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        icon: CheckCircle2,
    },
    cancelled: {
        label: 'Dibatalkan',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
        icon: XCircle,
    },
};

const NEXT_STATUS: Record<string, { label: string; next: string; color: string }> = {
    pending:    { label: 'Konfirmasi', next: 'confirmed',  color: 'bg-teal-600 hover:bg-teal-700 text-white' },
    confirmed:  { label: 'Proses',     next: 'processing', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    processing: { label: 'Kirim',      next: 'shipped',    color: 'bg-purple-600 hover:bg-purple-700 text-white' },
    shipped:    { label: 'Selesaikan', next: 'completed',  color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
};

/* ─────────────────────── HELPERS ───────────────────────────── */
const fmtIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function cleanPhoneForWA(phone: string): string {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) {
        clean = '62' + clean.slice(1);
    }
    return clean;
}

export default function OrdersIndex({ orders, filters, counts }: Props) {
    const flash = (usePage().props as any).flash ?? {};
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_method || 'all');

    // Accordion expand states
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

    // Image Zoom Modal for QRIS payment proof
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    // Copy to clipboard notification
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const applyFilter = (newStatus?: string, newSearch?: string, newPayment?: string) => {
        const s = newStatus !== undefined ? newStatus : statusFilter;
        const q = newSearch !== undefined ? newSearch : search;
        const p = newPayment !== undefined ? newPayment : paymentFilter;

        router.get(
            '/admin/pesanan',
            {
                status: s,
                search: q,
                payment_method: p,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter(undefined, search, undefined);
    };

    const updateStatus = (orderId: number, newStatus: string) => {
        router.post(
            `/admin/pesanan/${orderId}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
            }
        );
    };

    const deleteOrder = (orderId: number, orderNum: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pesanan #${orderNum}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(`/admin/pesanan/${orderId}`, {
                preserveScroll: true,
            });
        }
    };

    const tabs = [
        { key: 'all',        label: 'Semua',        count: counts.all ?? 0 },
        { key: 'pending',    label: 'Menunggu',     count: counts.pending ?? 0 },
        { key: 'confirmed',  label: 'Dikonfirmasi', count: counts.confirmed ?? 0 },
        { key: 'processing', label: 'Diproses',     count: counts.processing ?? 0 },
        { key: 'shipped',    label: 'Dikirim',      count: counts.shipped ?? 0 },
        { key: 'completed',  label: 'Selesai',      count: counts.completed ?? 0 },
        { key: 'cancelled',  label: 'Dibatalkan',   count: counts.cancelled ?? 0 },
    ];

    return (
        <MobileAdminLayout title="Kelola Pesanan">
            <div className="relative pb-10">

                {/* Flash Notice */}
                {flash.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl px-4 py-3 mb-5 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-teal-600" />
                            Kelola Pesanan
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Daftar pesanan masuk. Klik baris untuk melihat rincian produk, alamat, dan ubah status.
                        </p>
                    </div>

                    {/* Search & Payment Filter */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari No. Order / Nama / HP..."
                                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs transition"
                            />
                        </form>

                        <select
                            value={paymentFilter}
                            onChange={e => {
                                setPaymentFilter(e.target.value);
                                applyFilter(undefined, undefined, e.target.value);
                            }}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="all">Semua Pembayaran</option>
                            <option value="qris">QRIS</option>
                            <option value="cod">COD (Bayar di Tempat)</option>
                        </select>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-none">
                    {tabs.map(tab => {
                        const active = statusFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(tab.key);
                                    applyFilter(tab.key, undefined, undefined);
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                    active
                                        ? 'bg-teal-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                                        active
                                            ? 'bg-teal-700/60 text-white'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Orders List */}
                {orders.data.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700">Tidak ada pesanan ditemukan</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Belum ada transaksi dengan filter atau kata kunci yang dipilih.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {orders.data.map(order => {
                            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                            const nextAction = NEXT_STATUS[order.status];
                            const isExpanded = !!expandedIds[order.id];
                            const waLink = `https://wa.me/${cleanPhoneForWA(order.customer_phone)}?text=${encodeURIComponent(
                                `Halo Kak ${order.customer_name}, kami dari tim toko terkait pesanan #${order.order_number}...`
                            )}`;

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-150 hover:border-slate-300"
                                >
                                    {/* Collapsed Single Row */}
                                    <div
                                        onClick={() => toggleExpand(order.id)}
                                        className="px-3.5 py-3 sm:px-4 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50/80 transition select-none"
                                    >
                                        {/* Kiri: Nomor Pesanan, Nama Pelanggan, Waktu, Jumlah Item */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(order.order_number, `num-${order.id}`);
                                                }}
                                                title="Salin nomor pesanan"
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold shrink-0 transition"
                                            >
                                                <span>#{order.order_number}</span>
                                                {copiedId === `num-${order.id}` ? (
                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3 h-3 text-slate-400" />
                                                )}
                                            </button>

                                            <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                    {order.customer_name}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    {order.created_at}
                                                </span>
                                                <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                                                    {order.items_count} item
                                                </span>
                                            </div>
                                        </div>

                                        {/* Kanan: Metode Bayar, Status, Total Harga, Toggle Chevron */}
                                        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                            <div className="flex items-center gap-2">
                                                {/* Payment badge */}
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                                    order.payment_method === 'qris'
                                                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                                                        : 'bg-stone-100 text-stone-700 border-stone-200'
                                                }`}>
                                                    {order.payment_method === 'qris' ? (
                                                        <>
                                                            <QrCode className="w-3 h-3 text-teal-600" />
                                                            <span>QRIS</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Truck className="w-3 h-3 text-stone-500" />
                                                            <span>COD</span>
                                                        </>
                                                    )}
                                                </span>

                                                {/* Status badge */}
                                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    <span>{cfg.label}</span>
                                                </span>
                                            </div>

                                            {/* Total Price */}
                                            <div className="text-right pl-1">
                                                <span className="text-xs sm:text-sm font-black text-slate-900" style={{ color: 'var(--price-color, #E63854)' }}>
                                                    {fmtIDR(order.total_price)}
                                                </span>
                                            </div>

                                            {/* Toggle Chevron */}
                                            <div
                                                className={`p-1 rounded-md text-slate-400 hover:text-slate-700 transition-transform duration-200 ${
                                                    isExpanded ? 'rotate-180 text-teal-600' : ''
                                                }`}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Panel */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100 bg-slate-50/60 p-3.5 sm:p-5 space-y-3.5">
                                            {/* 1. Item Breakdown - STRICTLY TEXT ONLY, NO PHOTOS */}
                                            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                                                <div className="px-3.5 py-2 bg-slate-100/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                                    Rincian Item Produk
                                                </div>
                                                <div className="divide-y divide-slate-100">
                                                    {order.items.map((it) => (
                                                        <div key={it.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-semibold text-slate-900 truncate">
                                                                    {it.product_name}
                                                                </p>
                                                                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                                                    {fmtIDR(it.unit_price)} × {it.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="text-right shrink-0 font-bold text-slate-800">
                                                                {fmtIDR(it.subtotal_price)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {order.notes && (
                                                    <div className="p-3 bg-amber-50/80 border-t border-amber-200/60 text-xs text-amber-800">
                                                        <span className="font-bold">Catatan:</span> {order.notes}
                                                    </div>
                                                )}
                                                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
                                                    <span>Total Pembayaran</span>
                                                    <span className="text-sm font-black" style={{ color: 'var(--price-color, #E63854)' }}>
                                                        {fmtIDR(order.total_price)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 2. Customer & Address Information */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 space-y-2 text-xs shadow-2xs">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                        Penerima & Kontak
                                                    </span>
                                                    <p className="font-bold text-slate-900 text-sm">
                                                        {order.customer_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{order.customer_phone}</span>
                                                    </div>
                                                    <div className="pt-1">
                                                        <a
                                                            href={waLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>Hubungi WhatsApp</span>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 space-y-2 text-xs shadow-2xs">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                        Alamat Pengiriman
                                                    </span>
                                                    <div className="flex items-start gap-1.5 text-slate-700 leading-relaxed">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                                        <span>{order.customer_address}</span>
                                                    </div>
                                                    <div className="pt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(order.customer_address, `addr-${order.id}`)}
                                                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-teal-700 transition"
                                                        >
                                                            {copiedId === `addr-${order.id}` ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                                    <span className="text-emerald-600">Alamat Disalin</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span>Salin Alamat</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Payment Status & Action Controls */}
                                            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
                                                {/* Payment Detail */}
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                            Pembayaran
                                                        </span>
                                                        <span className="font-bold text-slate-800 uppercase">
                                                            {order.payment_method}
                                                        </span>
                                                    </div>

                                                    {order.payment_method === 'qris' && (
                                                        order.payment_proof_url ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setZoomImage(order.payment_proof_url)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span>Lihat Bukti Bayar</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                                                Belum ada bukti bayar
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2 flex-wrap ml-auto">
                                                    {nextAction && (
                                                        <button
                                                            type="button"
                                                            onClick={() => updateStatus(order.id, nextAction.next)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${nextAction.color}`}
                                                        >
                                                            {nextAction.label}
                                                        </button>
                                                    )}

                                                    <select
                                                        value={order.status}
                                                        onChange={e => updateStatus(order.id, e.target.value)}
                                                        className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs focus:ring-1 focus:ring-teal-500"
                                                    >
                                                        <option value="pending">Status: Menunggu</option>
                                                        <option value="confirmed">Status: Dikonfirmasi</option>
                                                        <option value="processing">Status: Diproses</option>
                                                        <option value="shipped">Status: Dikirim</option>
                                                        <option value="completed">Status: Selesai</option>
                                                        <option value="cancelled">Status: Dibatalkan</option>
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() => deleteOrder(order.id, order.order_number)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                        title="Hapus Pesanan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center items-center gap-1 mt-8">
                        {orders.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                    link.active
                                        ? 'bg-teal-600 text-white shadow-xs'
                                        : link.url
                                        ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* QRIS Transfer Proof Zoom Modal */}
                {zoomImage && (
                    <div
                        className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                        onClick={() => setZoomImage(null)}
                    >
                        <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() => setZoomImage(null)}
                                className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <img
                                src={zoomImage}
                                alt="Bukti Pembayaran"
                                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </MobileAdminLayout>
    );
}
