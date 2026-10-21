import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    FileText,
    Star,
    Settings,
    ExternalLink,
    LogOut,
    ArrowLeft,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react';

interface Props {
    children: ReactNode;
    title?: string;
    backHref?: string;
}

const NAV_ITEMS = [
    {
        href: '/admin',
        label: 'Dashboard',
        match: (p: string) => p === '/admin',
        icon: LayoutDashboard,
    },
    {
        href: '/admin/pesanan',
        label: 'Pesanan',
        match: (p: string) => p.startsWith('/admin/pesanan'),
        icon: ShoppingCart,
    },
    {
        href: '/admin/produk',
        label: 'Produk',
        match: (p: string) => p.startsWith('/admin/produk'),
        icon: Package,
    },
    {
        href: '/admin/artikel',
        label: 'Artikel',
        match: (p: string) => p.startsWith('/admin/artikel'),
        icon: FileText,
    },
    {
        href: '/admin/ulasan',
        label: 'Ulasan',
        match: (p: string) => p.startsWith('/admin/ulasan'),
        icon: Star,
    },
    {
        href: '/admin/pengaturan',
        label: 'Pengaturan',
        match: (p: string) => p.startsWith('/admin/pengaturan'),
        icon: Settings,
    },
];

export default function MobileAdminLayout({ children, title, backHref }: Props) {
    const { url, props } = usePage();
    const pathname = url.split('?')[0];
    const user = (props as any).auth?.user;
    const shopSettings = (props as any).shopSettings;
    const shopName = shopSettings?.shop_name || 'Admin Panel';

    const isDashboard = pathname === '/admin';
    const mobileNavItems = NAV_ITEMS.filter((item) => item.href !== '/admin');

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-slate-900 z-30">
                {/* Brand */}
                <div className="h-16 flex items-center px-5 border-b border-slate-800 gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{shopName}</div>
                        <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Admin Panel</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <div className="px-2 pb-3 pt-1 text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                        Navigasi
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const active = item.match(pathname);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    active
                                        ? 'bg-white text-slate-900'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-600' : ''}`} />
                                <span className="truncate">{item.label}</span>
                                {active && <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-white hover:bg-slate-800 transition"
                    >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        Lihat Toko Publik
                    </Link>

                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-300 font-black text-xs flex items-center justify-center shrink-0 uppercase">
                                {user?.name ? user.name.charAt(0) : 'A'}
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-300 truncate">{user?.name ?? 'Admin'}</div>
                                <div className="text-[10px] text-slate-600 truncate">{user?.email ?? ''}</div>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            title="Keluar"
                            className="p-1.5 rounded-md text-slate-600 hover:text-rose-400 hover:bg-slate-900 transition shrink-0"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-60">

                {/* Desktop Topbar */}
                <header className="hidden md:flex h-14 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 items-center justify-between">
                    <div className="flex items-center gap-3">
                        {backHref && (
                            <Link
                                href={backHref}
                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        )}
                        <h1 className="text-sm font-bold text-slate-900">{title ?? 'Dashboard'}</h1>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Lihat Toko
                    </Link>
                </header>

                {/* Mobile Topbar */}
                <header className="flex md:hidden h-14 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {backHref ? (
                            <Link
                                href={backHref}
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/admin"
                                className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0"
                                title="Ke Dashboard"
                            >
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </Link>
                        )}
                        <span className="text-sm font-bold text-slate-900 truncate">
                            {title ?? shopName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Tombol kembali ke Dashboard (muncul di samping Toko saat di halaman fitur) */}
                        {!isDashboard && (
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-2.5 py-1.5 rounded-lg hover:bg-teal-100 transition shadow-xs"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span>Dashboard</span>
                            </Link>
                        )}

                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition"
                        >
                            Toko
                        </Link>
                    </div>
                </header>

                {/* Main */}
                <main className={`flex-1 w-full max-w-360 mx-auto p-4 sm:p-6 lg:p-8 ${isDashboard ? 'pb-8 md:pb-8' : 'pb-24 md:pb-8'}`}>
                    {children}
                </main>
            </div>

            {/* ── MOBILE BOTTOM NAV (Hanya tampil di luar Dashboard, tepat 5 menu kelola) ── */}
            {!isDashboard && (
                <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[max(env(safe-area-inset-bottom,4px),4px)] shadow-lg">
                    <div className="flex items-stretch w-full pt-1 px-1">
                        {mobileNavItems.map((item) => {
                            const active = item.match(pathname);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 rounded-xl text-[10px] font-bold transition ${
                                        active ? 'text-teal-700' : 'text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    <div
                                        className={`p-1.5 rounded-lg transition mb-0.5 ${
                                            active ? 'bg-teal-600 text-white shadow-xs' : ''
                                        }`}
                                    >
                                        <Icon className="w-[18px] h-[18px]" />
                                    </div>
                                    <span className="truncate max-w-[56px]">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
