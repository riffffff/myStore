import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from '@/Contexts/ThemeContext';
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
    Menu,
    X,
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

const BOTTOM_NAV_ITEMS = [
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
        href: '/admin/pengaturan',
        label: 'Pengaturan',
        match: (p: string) => p.startsWith('/admin/pengaturan'),
        icon: Settings,
    },
];

export default function AdminLayout({ children, title, backHref }: Props) {
    const { url, props } = usePage();
    const pathname = url.split('?')[0];
    const user = (props as any).auth?.user;
    const shopSettings = (props as any).shopSettings;
    const shopName = shopSettings?.shop_name || 'Admin Panel';

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <ThemeProvider>
            <div
                className="min-h-screen font-sans flex transition-colors text-slate-900"
                style={{
                    backgroundColor: 'var(--color-admin-bg)',
                    color: 'var(--color-admin-text)',
                    fontFamily: 'var(--font-family, sans-serif)',
                }}
            >

                {/* ── DESKTOP SIDEBAR ── */}
                <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-slate-900 z-30">
                    {/* Brand */}
                    <div className="h-16 flex items-center px-5 border-b border-slate-800 gap-3 shrink-0">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                            style={{ background: 'var(--color-brand)' }}
                        >
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
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <Icon
                                        className="w-4 h-4 shrink-0 transition-colors"
                                        style={active ? { color: 'var(--color-brand)' } : undefined}
                                    />
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
                <header
                    className="hidden md:flex h-14 border-b sticky top-0 z-20 px-6 items-center justify-between transition-colors"
                    style={{
                        backgroundColor: 'var(--color-admin-surface)',
                        borderColor: 'var(--color-admin-border)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        {backHref && (
                            <Link
                                href={backHref}
                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        )}
                        <h1 className="text-sm font-bold" style={{ color: 'var(--color-admin-text)' }}>
                            {title ?? 'Dashboard'}
                        </h1>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition"
                        style={{
                            backgroundColor: 'var(--color-brand-50)',
                            color: 'var(--color-brand-700)',
                        }}
                    >
                        <ExternalLink className="w-3 h-3" />
                        Lihat Toko
                    </Link>
                </header>

                {/* Mobile Topbar */}
                <header
                    className="flex md:hidden h-14 border-b sticky top-0 z-20 px-4 items-center justify-between transition-colors"
                    style={{
                        backgroundColor: 'var(--color-admin-surface)',
                        borderColor: 'var(--color-admin-border)',
                    }}
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        {backHref ? (
                            <Link
                                href={backHref}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 shrink-0"
                                style={{ backgroundColor: 'var(--color-brand-50)' }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/admin"
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                                style={{
                                    backgroundColor: 'var(--color-brand)',
                                    color: 'var(--color-brand-contrast)',
                                }}
                                title="Ke Dashboard"
                            >
                                <ShieldCheck className="w-4 h-4" />
                            </Link>
                        )}
                        <span className="text-sm font-bold truncate" style={{ color: 'var(--color-admin-text)' }}>
                            {title ?? shopName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                            style={{
                                backgroundColor: 'var(--color-brand-50)',
                                color: 'var(--color-brand-700)',
                            }}
                        >
                            Toko
                        </Link>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 w-full max-w-360 mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav
                className="flex md:hidden fixed bottom-0 left-0 right-0 z-30 border-t pb-[max(env(safe-area-inset-bottom,4px),4px)] shadow-lg"
                style={{
                    backgroundColor: 'var(--color-admin-surface)',
                    borderColor: 'var(--color-admin-border)',
                }}
            >
                <div className="flex items-stretch w-full pt-1 px-1">
                    {BOTTOM_NAV_ITEMS.map((item) => {
                        const active = item.match(pathname);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 rounded-xl text-[10px] font-bold transition ${
                                    active ? 'text-brand-700' : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <div
                                    className={`p-1.5 rounded-lg transition mb-0.5 ${
                                        active ? 'bg-brand-50 text-brand-700' : ''
                                    }`}
                                >
                                    <Icon className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-[10px] tracking-tight whitespace-nowrap text-center">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Tab 5: Menu */}
                    {(() => {
                        const isSecondaryActive =
                            isMenuOpen ||
                            pathname.startsWith('/admin/artikel') ||
                            pathname.startsWith('/admin/ulasan');
                        return (
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(true)}
                                className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 rounded-xl text-[10px] font-bold transition ${
                                    isSecondaryActive ? 'text-brand-700' : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <div
                                    className={`p-1.5 rounded-lg transition mb-0.5 ${
                                        isSecondaryActive ? 'bg-brand-50 text-brand-700' : ''
                                    }`}
                                >
                                    <Menu className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-[10px] tracking-tight whitespace-nowrap text-center">Menu</span>
                            </button>
                        );
                    })()}
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                        className="relative z-10 w-full rounded-t-2xl border-t p-4 pb-8 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200"
                        style={{
                            backgroundColor: 'var(--color-admin-surface)',
                            borderColor: 'var(--color-admin-border)',
                        }}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{user?.name ?? 'Admin'}</div>
                                <div className="text-[10px] text-slate-500 truncate">{user?.email ?? ''}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href="/admin/artikel"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                                    pathname.startsWith('/admin/artikel')
                                        ? 'bg-brand-50 text-brand-700'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span>Artikel</span>
                            </Link>

                            <Link
                                href="/admin/ulasan"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                                    pathname.startsWith('/admin/ulasan')
                                        ? 'bg-brand-50 text-brand-700'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <Star className="w-4 h-4 text-slate-400" />
                                <span>Ulasan</span>
                            </Link>

                            <Link
                                href="/"
                                target="_blank"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                                <span>Lihat Toko Publik</span>
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />
                                <span>Keluar</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </ThemeProvider>
    );
}
