import MobileAdminLayout from '@/Layouts/MobileAdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Filler,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
    Package, FileText, Star, ShoppingCart, ChevronRight,
    TrendingUp, AlertCircle, Clock, CheckCircle2, Calendar,
    ExternalLink, ArrowUpRight, Sparkles, Layers, Eye,
    Check, Activity, BarChart3,
} from 'lucide-react';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Filler,
);

/* ─────────────────────────── TYPES ─────────────────────────── */
interface Stats {
    products: number; published: number; out_of_stock: number;
    articles: number; published_articles: number;
    reviews: number; pending_reviews: number;
    orders_total: number; orders_pending: number; revenue_total: number;
}
interface SalesPoint { date: string; orders: number; revenue: number; }
interface StockChart  { available?: number; preorder?: number; out_of_stock?: number; sold?: number; }
interface TopArticle  { id: number; title: string; views_count: number; }
interface RecentOrder {
    id: number; order_number: string; customer_name: string;
    total_price: number; status: string; created_at: string;
}
interface PendingReview {
    id: number; author_name: string; rating: number; body: string; created_at: string;
}
interface Props {
    stats: Stats; stockChart: StockChart; salesChart: SalesPoint[];
    topArticles: TopArticle[]; recentOrders: RecentOrder[];
    pendingReviews: PendingReview[]; period: string;
    startDate?: string; endDate?: string;
}

/* ─────────────────────── THEME CONSTANTS ─────────────────────── */
const TEAL = '#0D9488';
const TEAL_LIGHT = '#14B8A6';
const AMBER = '#F59E0B';
const ROSE = '#F43F5E';
const SLATE = '#334155';

/* ─────────────────────── HELPERS ───────────────────────────── */
const fmtIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const fmtShort = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt`
    : n >= 1_000   ? `${(n / 1_000).toFixed(0)}rb` : String(n);
const fmtDate = (d: string) => {
    if (!d) return '';
    if (d.includes(':')) return d;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

/* ─────────── SMOOTH NUMBER COUNTER WITH EASING ──────────────── */
function AnimatedNumber({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
    const [val, setVal] = useState(0);
    const prevTo = useRef(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1000;
        const startVal = prevTo.current;
        prevTo.current = to;

        let frameId: number;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(startVal + (to - startVal) * ease);
            setVal(current);
            if (progress < 1) {
                frameId = requestAnimationFrame(step);
            }
        };
        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [to]);

    return <>{prefix}{val.toLocaleString('id-ID')}{suffix}</>;
}

/* ─────────── STAGGERED FADE-IN WRAPPER ──────────────────────── */
function FadeIn({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div className={className} style={{
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
            {children}
        </div>
    );
}

/* ─────────── 1. MODERN DONUT STOCK CHART ────────────────────── */
function StockDonut({ data }: { data: StockChart }) {
    const available    = data.available    ?? 0;
    const preorder     = data.preorder     ?? 0;
    const out_of_stock = data.out_of_stock ?? 0;
    const sold         = data.sold         ?? 0;
    const total        = available + preorder + out_of_stock + sold;

    const chartData = {
        labels: ['Tersedia', 'Pre-order', 'Habis', 'Terjual'],
        datasets: [{
            data: [available, preorder, out_of_stock, sold],
            backgroundColor: [TEAL, AMBER, ROSE, SLATE],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 10,
        }],
    };

    const options: any = {
        cutout: '74%',
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1200,
            easing: 'easeOutQuart',
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#cbd5e1',
                padding: 12,
                cornerRadius: 10,
                boxPadding: 6,
                callbacks: {
                    label: (ctx: any) => {
                        const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
                        return ` ${ctx.label}: ${ctx.raw} unit (${pct}%)`;
                    },
                },
            },
        },
    };

    const items = [
        { label: 'Tersedia',  count: available,    color: TEAL,  bg: 'bg-teal-50',  text: 'text-teal-700',  border: 'border-teal-200' },
        { label: 'Pre-order', count: preorder,     color: AMBER, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        { label: 'Habis',     count: out_of_stock, color: ROSE,  bg: 'bg-rose-50',  text: 'text-rose-700',  border: 'border-rose-200' },
        { label: 'Terjual',   count: sold,         color: SLATE, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    ];

    return (
        <div className="flex flex-col h-full justify-between">
            {/* Donut Container with Glowing Center */}
            <div className="relative my-auto py-2 flex items-center justify-center">
                <div className="w-52 h-52 relative">
                    <Doughnut data={chartData} options={options} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-900 tracking-tight">
                            <AnimatedNumber to={total} />
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Total Unit
                        </span>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            Live Catalog
                        </span>
                    </div>
                </div>
            </div>

            {/* Segmented Distribution Bar */}
            {total > 0 && (
                <div className="mb-4">
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex gap-0.5 p-0.5">
                        {items.map((it, idx) => {
                            const pct = (it.count / total) * 100;
                            if (pct === 0) return null;
                            return (
                                <div
                                    key={idx}
                                    style={{ width: `${pct}%`, backgroundColor: it.color }}
                                    className="h-full rounded-full transition-all duration-1000"
                                    title={`${it.label}: ${Math.round(pct)}%`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Interactive Legend Grid */}
            <div className="grid grid-cols-2 gap-2">
                {items.map((it) => {
                    const pct = total > 0 ? Math.round((it.count / total) * 100) : 0;
                    return (
                        <div
                            key={it.label}
                            className={`p-2.5 rounded-xl border ${it.border} ${it.bg} flex items-center justify-between transition-all duration-200 hover:scale-[1.02]`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: it.color }} />
                                <span className="text-xs font-bold text-slate-700">{it.label}</span>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-black ${it.text}`}>{it.count}</span>
                                <span className="text-[10px] text-slate-400 ml-1 font-semibold">({pct}%)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────── 2. MODERN LINE SALES CHART ─────────────────────── */
function SalesLine({
    data,
    period,
    startDate = '',
    endDate = '',
    onChangePeriod,
    onApplyCustomRange,
}: {
    data: SalesPoint[];
    period: string;
    startDate?: string;
    endDate?: string;
    onChangePeriod: (p: string) => void;
    onApplyCustomRange: (start: string, end: string) => void;
}) {
    const [mode, setMode] = useState<'revenue' | 'orders'>('revenue');
    const [customStart, setCustomStart] = useState(startDate);
    const [customEnd, setCustomEnd] = useState(endDate);
    const [showRangePicker, setShowRangePicker] = useState(period === 'custom');

    const labels  = data.map(d => fmtDate(d.date));
    const values  = data.map(d => mode === 'revenue' ? d.revenue : d.orders);
    const isEmpty = data.length === 0;

    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
    const totalOrders  = data.reduce((s, d) => s + d.orders, 0);
    const peakValue    = values.length > 0 ? Math.max(...values) : 0;
    const avgValue     = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

    const chartData = {
        labels,
        datasets: [{
            label: mode === 'revenue' ? 'Pendapatan' : 'Pesanan',
            data: values,
            fill: true,
            tension: 0.42,
            borderColor: TEAL,
            borderWidth: 3,
            backgroundColor: (ctx: any) => {
                const canvas = ctx.chart.ctx;
                const gradient = canvas.createLinearGradient(0, 0, 0, 260);
                gradient.addColorStop(0,   'rgba(13, 148, 136, 0.32)');
                gradient.addColorStop(0.6, 'rgba(13, 148, 136, 0.08)');
                gradient.addColorStop(1,   'rgba(13, 148, 136, 0.00)');
                return gradient;
            },
            pointBackgroundColor: '#ffffff',
            pointBorderColor: TEAL,
            pointBorderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: TEAL,
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
        }],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1100,
            easing: 'easeOutQuart',
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#ffffff',
                titleFont: { size: 12, weight: 'bold' },
                bodyColor: '#e2e8f0',
                bodyFont: { size: 13, weight: '600' },
                padding: 12,
                cornerRadius: 10,
                boxPadding: 6,
                callbacks: {
                    label: (ctx: any) =>
                        mode === 'revenue'
                            ? ` Pendapatan: ${fmtIDR(ctx.raw)}`
                            : ` Pesanan: ${ctx.raw} pesanan`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { size: 10, weight: '500' },
                    color: '#94a3b8',
                    maxTicksLimit: 9,
                },
            },
            y: {
                grid: { color: 'rgba(226, 232, 240, 0.6)' },
                border: { display: false },
                ticks: {
                    font: { size: 10, weight: '500' },
                    color: '#94a3b8',
                    callback: (v: any) =>
                        mode === 'revenue' ? fmtShort(v) : v,
                },
            },
        },
    };

    const periods = [
        { key: 'today',  label: 'Hari Ini' },
        { key: '7',      label: '7 Hari' },
        { key: '30',     label: '30 Hari' },
        { key: 'custom', label: 'Rentang' },
    ];

    const handleSelectPeriod = (key: string) => {
        if (key === 'custom') {
            setShowRangePicker(prev => !prev);
        } else {
            setShowRangePicker(false);
            onChangePeriod(key);
        }
    };

    return (
        <div>
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {/* Metric Mode Switcher */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-inner">
                    {(['revenue', 'orders'] as const).map((k) => {
                        const active = mode === k;
                        return (
                            <button
                                key={k}
                                type="button"
                                onClick={() => setMode(k)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    active
                                        ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {k === 'revenue' ? 'Pendapatan' : 'Pesanan'}
                            </button>
                        );
                    })}
                </div>

                {/* Period Selector Tabs */}
                <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
                    {periods.map(p => {
                        const isActive = p.key === 'custom' ? (period === 'custom' || showRangePicker) : period === p.key;
                        return (
                            <button
                                key={p.key}
                                type="button"
                                onClick={() => handleSelectPeriod(p.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Custom Date Range Picker */}
            {showRangePicker && (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-teal-50/60 rounded-xl border border-teal-200/70 shadow-sm animate-saas-entrance">
                    <div className="flex items-center gap-2 text-xs text-slate-700 flex-wrap">
                        <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="font-bold text-teal-900">Rentang Tanggal:</span>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="text-xs px-2.5 py-1.5 bg-white border border-teal-200 rounded-lg text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        />
                        <span className="text-teal-400 font-bold">—</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="text-xs px-2.5 py-1.5 bg-white border border-teal-200 rounded-lg text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (customStart && customEnd) {
                                onApplyCustomRange(customStart, customEnd);
                            }
                        }}
                        disabled={!customStart || !customEnd}
                        className="px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-teal-600/30 disabled:opacity-50 hover:brightness-110 ml-auto"
                        style={{ backgroundColor: TEAL }}
                    >
                        Terapkan Filter
                    </button>
                </div>
            )}

            {/* Chart Area */}
            {isEmpty ? (
                <div className="h-56 flex flex-col items-center justify-center bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl text-center p-6">
                    <Activity className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Belum ada transaksi pada periode ini</p>
                    <p className="text-xs text-slate-400 mt-0.5">Ubah rentang waktu untuk melihat aktivitas sebelumnya</p>
                </div>
            ) : (
                <div style={{ height: 220 }} className="relative">
                    <Line data={chartData} options={options} />
                </div>
            )}

            {/* Metric Micro-cards Under Chart */}
            {!isEmpty && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total {mode === 'revenue' ? 'Omset' : 'Order'}</div>
                        <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                            {mode === 'revenue' ? fmtIDR(totalRevenue) : `${totalOrders} transaksi`}
                        </div>
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata</div>
                        <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                            {mode === 'revenue' ? fmtIDR(avgValue) : `${avgValue} / titik`}
                        </div>
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Puncak Tertinggi</div>
                        <div className="text-sm sm:text-base font-black text-teal-700 mt-0.5">
                            {mode === 'revenue' ? fmtIDR(peakValue) : `${peakValue} order`}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────── 3. MODERN HORIZONTAL BAR (TOP ARTICLES) ───────── */
function ArticlesBar({ articles }: { articles: TopArticle[] }) {
    if (articles.length === 0) {
        return (
            <div className="h-40 flex flex-col items-center justify-center bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl text-center p-6">
                <FileText className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Belum ada statistik pembaca artikel</p>
            </div>
        );
    }

    const maxViews = Math.max(...articles.map(a => a.views_count), 1);
    const labels   = articles.map(a => a.title.length > 30 ? a.title.slice(0, 30) + '…' : a.title);

    const chartData = {
        labels,
        datasets: [{
            label: 'Pembacaan',
            data: articles.map(a => a.views_count),
            backgroundColor: articles.map((_, i) =>
                i === 0 ? TEAL : `rgba(13, 148, 136, ${Math.max(0.75 - i * 0.12, 0.25)})`
            ),
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 24,
        }],
    };

    const options: any = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 950, easing: 'easeOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#ffffff',
                titleFont: { size: 12, weight: 'bold' },
                bodyColor: '#e2e8f0',
                padding: 12,
                cornerRadius: 10,
                boxPadding: 6,
                callbacks: {
                    title: (ctx: any) => articles[ctx[0].dataIndex]?.title ?? '',
                    label: (ctx: any) => ` ${ctx.raw.toLocaleString('id-ID')} kali dibaca`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(226, 232, 240, 0.5)' },
                border: { display: false },
                ticks: { font: { size: 10, weight: '500' }, color: '#94a3b8' },
            },
            y: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { size: 11, weight: '600' as any },
                    color: '#334155',
                },
            },
        },
    };

    return (
        <div>
            {/* Chart */}
            <div style={{ height: Math.max(articles.length * 48 + 24, 150) }} className="relative mb-4">
                <Bar data={chartData} options={options} />
            </div>

            {/* Ranked List Leaderboard */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
                {articles.map((art, idx) => {
                    const pct = Math.round((art.views_count / maxViews) * 100);
                    return (
                        <Link
                            key={art.id}
                            href={`/admin/artikel/${art.id}/edit`}
                            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200/80"
                        >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                idx === 0 ? 'bg-amber-100 text-amber-800' :
                                idx === 1 ? 'bg-slate-200 text-slate-800' :
                                idx === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                                #{idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors truncate">
                                    {art.title}
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-600 shrink-0 bg-slate-100 px-2 py-1 rounded-lg">
                                <Eye className="w-3 h-3 text-slate-400" />
                                {art.views_count.toLocaleString('id-ID')}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────── ORDER STATUS BADGE ────────────────────────────── */
const ORDER_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
    pending:   { label: 'Pending',  cls: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500' },
    paid:      { label: 'Dibayar',  cls: 'bg-teal-50 text-teal-700 border-teal-200',     dot: 'bg-teal-500' },
    shipped:   { label: 'Dikirim',  cls: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500' },
    completed: { label: 'Selesai',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    cancelled: { label: 'Dibatal',  cls: 'bg-rose-50 text-rose-700 border-rose-200',     dot: 'bg-rose-500' },
};

/* ─────────────────────── MAIN DASHBOARD ────────────────────── */
export default function Dashboard({
    stats, stockChart, salesChart, topArticles,
    recentOrders, pendingReviews, period,
    startDate, endDate,
}: Props) {
    const { props } = usePage();
    const user = (props as any).auth?.user;
    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 11 ? 'Selamat pagi' :
        currentHour < 15 ? 'Selamat siang' :
        currentHour < 18 ? 'Selamat sore' : 'Selamat malam';

    const handlePeriod = (p: string) =>
        router.get('/admin', { period: p }, { preserveScroll: true, preserveState: true });

    const handleCustomRange = (start: string, end: string) =>
        router.get('/admin', { period: 'custom', start_date: start, end_date: end }, { preserveScroll: true, preserveState: true });

    const kpi = [
        {
            label: 'Total Pesanan',
            value: stats.orders_total,
            badge: stats.orders_pending > 0 ? `${stats.orders_pending} Menunggu` : 'Stabil',
            badgeCls: stats.orders_pending > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-teal-50 text-teal-700 border-teal-200',
            sub: 'Akumulasi seluruh transaksi',
            icon: ShoppingCart,
            warn: stats.orders_pending > 0,
            href: '/admin/pesanan',
        },
        {
            label: 'Pendapatan Bersih',
            formatted: fmtShort(stats.revenue_total),
            badge: '+ Omset Riil',
            badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            sub: 'Tidak termasuk order batal',
            icon: TrendingUp,
            warn: false,
            href: '/admin',
        },
        {
            label: 'Ulasan Pending',
            value: stats.pending_reviews,
            badge: stats.pending_reviews > 0 ? 'Perlu Moderasi' : 'Terkendali',
            badgeCls: stats.pending_reviews > 0 ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200',
            sub: `Dari ${stats.reviews} ulasan masuk`,
            icon: Star,
            warn: stats.pending_reviews > 0,
            href: '/admin/ulasan',
        },
        {
            label: 'Stok Habis',
            value: stats.out_of_stock,
            badge: stats.out_of_stock > 0 ? 'Restock Segera' : 'Aman',
            badgeCls: stats.out_of_stock > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-teal-50 text-teal-700 border-teal-200',
            sub: `Dari ${stats.products} produk katalog`,
            icon: Package,
            warn: stats.out_of_stock > 0,
            href: '/admin/produk',
        },
    ];

    return (
        <MobileAdminLayout title="Dashboard">
            <div className="relative min-h-[90vh] pb-10">

                {/* ─── Ambient Glow Mesh Backdrop (SaaS Visual Layer) ─── */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-emerald-400/5 rounded-full blur-3xl pointer-events-none animate-saas-glow" />
                <div className="absolute top-72 left-10 w-80 h-80 bg-teal-400/8 rounded-full blur-3xl pointer-events-none" />

                {/* ─── Top Header Ribbon ─── */}
                <FadeIn delay={0}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-4 border-b border-slate-200/60">
                        <div>
                            {/* Live Badge */}
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/80 border border-slate-200/80 shadow-xs mb-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-slate-600">Sistem Realtime Aktif</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-teal-700 font-semibold">{greeting}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                {user?.name ?? 'Administrator'}
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Ringkasan performa penjualan, stok produk, dan interaksi pelanggan hari ini.
                            </p>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-2">
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200/80 shadow-xs hover:border-teal-500/40 hover:text-teal-700 hover:shadow-md transition-all duration-200"
                            >
                                <span>Lihat Toko Publik</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </FadeIn>

                {/* ─── 4 SaaS KPI Cards ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                    {kpi.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <FadeIn key={c.label} delay={60 + i * 50}>
                                <Link
                                    href={c.href}
                                    className={`relative block overflow-hidden rounded-2xl bg-white/85 backdrop-blur-xl border p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(13,148,136,0.16)] hover:-translate-y-1 hover:border-teal-500/50 transition-all duration-300 group h-full ${
                                        c.warn ? 'border-amber-300/80 ring-1 ring-amber-300/30' : 'border-slate-200/80'
                                    }`}
                                >
                                    {/* Top Glow Accent Bar */}
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Card Top: Icon & Status Badge */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${
                                            c.warn
                                                ? 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white'
                                                : 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-600 group-hover:text-white'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${c.badgeCls}`}>
                                            {c.badge}
                                        </span>
                                    </div>

                                    {/* Metric Value */}
                                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                                        {'value' in c
                                            ? <AnimatedNumber to={c.value!} />
                                            : c.formatted}
                                    </div>

                                    {/* Title & Micro description */}
                                    <div className="text-xs font-bold text-slate-700 mt-2 flex items-center justify-between">
                                        <span>{c.label}</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{c.sub}</div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>

                {/* ─── Pending Action Notification Banner ─── */}
                {stats.pending_reviews > 0 && (
                    <FadeIn delay={280}>
                        <Link
                            href="/admin/ulasan?filter=pending"
                            className="flex items-center justify-between gap-3 w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 mb-7 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
                                    <AlertCircle className="w-5 h-5 animate-bounce" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-amber-900">
                                        {stats.pending_reviews} ulasan baru menunggu konfirmasi
                                    </div>
                                    <div className="text-xs text-amber-700/80 mt-0.5 font-medium">
                                        Periksa ulasan pelanggan untuk menjaga reputasi dan transparansi katalog.
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <span>Tinjau</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </Link>
                    </FadeIn>
                )}

                {/* ─── Main Charts Row (2 Columns: Sales Line & Stock Donut) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">

                    {/* Sales Line Chart (2 cols) */}
                    <FadeIn delay={340} className="lg:col-span-2">
                        <section className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
                                        <h2 className="text-base font-black text-slate-900 tracking-tight">Statistik Penjualan</h2>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">Grafik performa transaksi dan pendapatan terverifikasi</p>
                                </div>
                            </div>
                            <SalesLine
                                data={salesChart}
                                period={period}
                                startDate={startDate}
                                endDate={endDate}
                                onChangePeriod={handlePeriod}
                                onApplyCustomRange={handleCustomRange}
                            />
                        </section>
                    </FadeIn>

                    {/* Stock Donut Chart (1 col) */}
                    <FadeIn delay={400}>
                        <section className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
                                        <h2 className="text-base font-black text-slate-900 tracking-tight">Status Produk</h2>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">Proporsi inventaris katalog toko</p>
                                </div>
                                <Link
                                    href="/admin/produk"
                                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
                                >
                                    Kelola <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <StockDonut data={stockChart} />
                        </section>
                    </FadeIn>
                </div>

                {/* ─── Top Articles Chart Row ─── */}
                <FadeIn delay={460}>
                    <section className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] mb-7">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
                                    <h2 className="text-base font-black text-slate-900 tracking-tight">Artikel Terpopuler</h2>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">Konten artikel dengan jumlah tayangan terbanyak</p>
                            </div>
                            <Link
                                href="/admin/artikel"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/80 hover:bg-teal-600 hover:text-white transition-all duration-200"
                            >
                                <span>Semua Artikel</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <ArticlesBar articles={topArticles} />
                    </section>
                </FadeIn>

                {/* ─── Bottom Feeds (Recent Orders & Pending Reviews) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Orders Feed */}
                    <FadeIn delay={520}>
                        <section className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-sm font-black text-slate-900">Pesanan Terbaru</h2>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Aktivitas order masuk terakhir</p>
                                </div>
                                <Link
                                    href="/admin/pesanan"
                                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
                                >
                                    Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            {recentOrders.length === 0 ? (
                                <div className="py-12 text-center text-sm text-slate-400">
                                    Belum ada transaksi pesanan
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentOrders.map(o => {
                                        const st = ORDER_STATUS[o.status] ?? {
                                            label: o.status,
                                            cls: 'bg-slate-100 text-slate-700 border-slate-200',
                                            dot: 'bg-slate-400',
                                        };
                                        return (
                                            <div
                                                key={o.id}
                                                className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors"
                                            >
                                                {/* Customer Avatar Icon */}
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200/60 shadow-xs">
                                                    {o.customer_name?.charAt(0).toUpperCase() || 'P'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs font-black text-slate-900 tracking-tight">
                                                            #{o.order_number}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                            {st.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                                        {o.customer_name} • {o.created_at}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-black text-slate-900 shrink-0">
                                                    {fmtIDR(o.total_price)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </FadeIn>

                    {/* Pending Reviews Feed */}
                    <FadeIn delay={580}>
                        <section className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-sm font-black text-slate-900">Ulasan Masuk</h2>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Feedback & penilaian pelanggan</p>
                                </div>
                                <Link
                                    href="/admin/ulasan"
                                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
                                >
                                    Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            {pendingReviews.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2 border border-teal-100 shadow-xs">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Semua ulasan telah diproses</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Tidak ada antrean ulasan yang tertunda</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {pendingReviews.map(r => (
                                        <div key={r.id} className="px-6 py-4 hover:bg-slate-50/70 transition-colors">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <span className="text-xs font-black text-slate-800">{r.author_name}</span>
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs"
                                                            style={{ color: i < r.rating ? AMBER : '#e2e8f0' }}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                "{r.body}"
                                            </p>
                                            <div className="flex items-center justify-between mt-2 pt-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    <span>{r.created_at}</span>
                                                </div>
                                                <Link
                                                    href="/admin/ulasan"
                                                    className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline"
                                                >
                                                    Moderasi →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </FadeIn>
                </div>
            </div>
        </MobileAdminLayout>
    );
}
