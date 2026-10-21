import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
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
    MapPin,
    Phone,
    ArrowLeft,
    X,
    Trash2,
} from 'lucide-react';

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal_price: number;
    image_url: string | null;
}

interface OrderDetail {
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
    user: { id: number; name: string; email: string } | null;
    items: OrderItem[];
}

interface Props {
    order: OrderDetail;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
> = {
    pending:    { label: 'Menunggu Konfirmasi', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500' },
    confirmed:  { label: 'Dikonfirmasi',        bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    dot: 'bg-teal-500' },
    processing: { label: 'Sedang Diproses',     bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500' },
    shipped:    { label: 'Sedang Dikirim',      bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  dot: 'bg-purple-500' },
    completed:  { label: 'Selesai',             bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    cancelled:  { label: 'Dibatalkan',          bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500' },
};

const fmtIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function cleanPhoneForWA(phone: string): string {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) {
        clean = '62' + clean.slice(1);
    }
    return clean;
}

export default function OrderShow({ order }: Props) {
    const flash = (usePage().props as any).flash ?? {};
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

    const copyAddress = () => {
        navigator.clipboard.writeText(order.customer_address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateStatus = (newStatus: string) => {
        router.post(`/admin/pesanan/${order.id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const deleteOrder = () => {
        if (confirm(`Yakin ingin menghapus pesanan #${order.order_number}?`)) {
            router.delete(`/admin/pesanan/${order.id}`);
        }
    };

    const waLink = `https://wa.me/${cleanPhoneForWA(order.customer_phone)}?text=${encodeURIComponent(
        `Halo Kak ${order.customer_name}, kami dari tim toko terkait pesanan #${order.order_number}...`
    )}`;

    return (
        <MobileAdminLayout title={`Pesanan #${order.order_number}`} backHref="/admin/pesanan">
            <div className="max-w-4xl mx-auto pb-12">
                {/* Flash */}
                {flash.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Back Button & Top Navigation */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <Link
                        href="/admin/pesanan"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Pesanan</span>
                    </Link>

                    <button
                        type="button"
                        onClick={deleteOrder}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus Pesanan
                    </button>
                </div>

                {/* Header Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-6 mb-6 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Pesanan #{order.order_number}
                                </h1>
                            </div>
                            <p className="text-xs text-slate-400">
                                Dipesan pada {order.created_at} ({order.created_at_human})
                            </p>
                        </div>

                        {/* Status Control */}
                        <div className="flex items-center gap-2.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                            </span>

                            <select
                                value={order.status}
                                onChange={e => updateStatus(e.target.value)}
                                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="pending">Menunggu</option>
                                <option value="confirmed">Dikonfirmasi</option>
                                <option value="processing">Diproses</option>
                                <option value="shipped">Dikirim</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid 2 Columns: Info Pelanggan & Pembayaran */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Pelanggan */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Informasi Pelanggan
                        </div>
                        <div className="text-base font-bold text-slate-900">
                            {order.customer_name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{order.customer_phone}</span>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition ml-auto"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Chat WhatsApp
                            </a>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed mb-2">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <span>{order.customer_address}</span>
                            </div>
                            <button
                                type="button"
                                onClick={copyAddress}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-teal-600 transition"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'Tersalin!' : 'Salin Alamat'}</span>
                            </button>
                        </div>
                        {order.notes && (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800">
                                <span className="font-bold">Catatan Pembeli:</span> {order.notes}
                            </div>
                        )}
                    </div>

                    {/* Pembayaran */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Metode & Verifikasi Pembayaran
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">Metode</span>
                            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                                {order.payment_method}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">Total Nominal</span>
                            <span className="text-base font-black text-teal-700">
                                {fmtIDR(order.total_price)}
                            </span>
                        </div>

                        {order.payment_method === 'qris' && (
                            <div className="pt-3 border-t border-slate-100">
                                <div className="text-xs font-bold text-slate-700 mb-2">Bukti Pembayaran QRIS:</div>
                                {order.payment_proof_url ? (
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={order.payment_proof_url}
                                            alt="Bukti Bayar"
                                            className="w-24 h-24 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition"
                                            onClick={() => setZoomImage(order.payment_proof_url)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setZoomImage(order.payment_proof_url)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Perbesar Gambar
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-rose-500 font-semibold">
                                        Pembeli belum mengunggah bukti pembayaran.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Daftar Produk Pesanan ({order.items.length} item)
                    </div>
                    <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100">
                        {order.items.map(it => (
                            <div key={it.id} className="p-4 flex items-center gap-3">
                                {it.image_url ? (
                                    <img
                                        src={it.image_url}
                                        alt={it.product_name}
                                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                        <ShoppingCart className="w-6 h-6" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-slate-900 truncate">
                                        {it.product_name}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        {fmtIDR(it.unit_price)} × {it.quantity} unit
                                    </div>
                                </div>
                                <div className="text-base font-black text-slate-900 shrink-0">
                                    {fmtIDR(it.subtotal_price)}
                                </div>
                            </div>
                        ))}
                        <div className="p-4 bg-slate-50 flex items-center justify-between font-black text-slate-900">
                            <span>Total Tagihan</span>
                            <span className="text-lg text-teal-700">{fmtIDR(order.total_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Image Zoom Modal */}
                {zoomImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
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
                                alt="Zoom Bukti"
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
