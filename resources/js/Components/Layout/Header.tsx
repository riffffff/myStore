import { Link } from '@inertiajs/react';
import { ShoppingCart, LogIn, UserPlus, LogOut, UserRound } from 'lucide-react';

interface HeaderProps {
    shopName: string;
    logoUrl: string;
    user: any;
    onMenuToggle: () => void;
    onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export default function Header({ shopName, logoUrl, user, onMenuToggle, onAuthModalOpen }: HeaderProps) {
    const navItems = [
        { href: route('home'), label: 'Beranda', active: route().current('home') },
        { href: route('products.index'), label: 'Katalog', active: route().current('products.*') },
        { href: route('articles.index'), label: 'Artikel', active: route().current('articles.*') },
        { href: route('orders.track'), label: 'Pesanan', active: route().current('orders.track') },
    ];

    return (
        <header
            className="sticky top-0 z-40"
            style={{
                background: 'var(--header-bg, #333333)',
                borderBottom: '1px solid color-mix(in srgb, var(--header-text, #FFFFFF) 10%, transparent)',
            }}
        >
            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center gap-4">

                    {/* Logo & Nama Toko */}
                    <div className="shrink-0 flex items-center">
                        <Link href={route('home')} className="flex items-center gap-3 group">
                            <div
                                className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                                style={{
                                    background: 'color-mix(in srgb, var(--header-active, #0D9488) 20%, transparent)',
                                    boxShadow: '0 0 0 1px color-mix(in srgb, var(--header-active, #0D9488) 40%, transparent), 0 2px 8px color-mix(in srgb, var(--header-active, #0D9488) 25%, transparent)',
                                }}
                            >
                                <img
                                    src={logoUrl}
                                    alt={shopName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-header-text tracking-tight">
                                {shopName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation — Pill style */}
                    <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                                    item.active
                                        ? 'text-white shadow-sm'
                                        : 'text-header-text/75 hover:text-header-text hover:bg-white/10'
                                }`}
                                style={item.active ? {
                                    background: 'var(--header-active, #0D9488)',
                                    boxShadow: '0 2px 12px color-mix(in srgb, var(--header-active, #0D9488) 40%, transparent)',
                                } : {}}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Right: Cart + Auth */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        {user ? (
                            <>
                                <Link
                                    href={route('cart.index')}
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/80 hover:text-white hover:bg-white/10 transition"
                                    aria-label="Keranjang Belanja"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>

                                {/* User pill */}
                                <Link
                                    href={route('profile.edit')}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-white/10"
                                    style={{ color: 'var(--header-text, #FFFFFF)' }}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: 'var(--header-active, #0D9488)',
                                            color: '#fff',
                                        }}
                                    >
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="max-w-28 truncate text-header-text">{user.name}</span>
                                </Link>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full text-header-text/70 hover:text-white hover:bg-white/10 transition font-medium"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Keluar</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('login')}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full text-header-text/80 hover:text-white hover:bg-white/10 transition font-medium border"
                                    style={{ borderColor: 'color-mix(in srgb, var(--header-text, #FFFFFF) 25%, transparent)' }}
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Masuk</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('register')}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full text-white font-bold transition-all hover:opacity-90 hover:scale-[1.03]"
                                    style={{
                                        background: 'var(--header-active, #0D9488)',
                                        boxShadow: '0 2px 12px color-mix(in srgb, var(--header-active, #0D9488) 40%, transparent)',
                                    }}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Daftar</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile: Cart + Profile */}
                    <div className="flex md:hidden items-center gap-1">
                        <Link
                            href={route('cart.index')}
                            className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/90 hover:text-white hover:bg-white/10 transition"
                            aria-label="Keranjang Belanja"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Link>
                        {user ? (
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl transition hover:bg-white/10"
                                aria-label="Profil Akun"
                            >
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: 'var(--header-active, #0D9488)' }}
                                >
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onAuthModalOpen('login')}
                                className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/90 hover:text-white hover:bg-white/10 transition"
                                aria-label="Masuk Akun"
                            >
                                <UserRound className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}
