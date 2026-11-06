import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, LogIn, UserPlus, LogOut, UserRound, Search, X } from 'lucide-react';
import { PageProps } from '@/types';

interface HeaderProps {
    shopName: string;
    logoUrl: string;
    user: any;
    onMenuToggle: () => void;
    onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export default function Header({ shopName, logoUrl, user, onMenuToggle, onAuthModalOpen }: HeaderProps) {
    const { cart } = usePage<PageProps>().props;
    const { url } = usePage();
    const cartCount = cart?.total_quantity ?? 0;

    const [searchQuery, setSearchQuery] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('search') || '';
        }
        return '';
    });
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
    const mobileToggleBtnRef = useRef<HTMLButtonElement>(null);

    // Sinkronkan kata kunci saat URL berubah (misal saat chip filter dihapus di halaman katalog)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentParam = new URLSearchParams(window.location.search).get('search') || '';
            setSearchQuery(currentParam);
        }
    }, [url]);

    // Fokus ke input saat search mobile dibuka
    useEffect(() => {
        if (isMobileSearchOpen && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);

    // Tutup searchbar saat user tap/klik bagian layar lain
    useEffect(() => {
        if (!isMobileSearchOpen) return;

        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node;
            if (
                mobileSearchContainerRef.current &&
                !mobileSearchContainerRef.current.contains(target)
            ) {
                setIsMobileSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [isMobileSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        setIsMobileSearchOpen(false);
        if (trimmed) {
            router.get(route('products.index'), { search: trimmed }, { preserveState: false });
        } else {
            router.get(route('products.index'), {}, { preserveState: false });
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('search')) {
            router.get(route('products.index'), {}, { preserveState: false });
        }
    };

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
                <div className="flex justify-between h-16 items-center gap-2 sm:gap-4">

                    {/* Logo & Nama Toko (atau Search Input di Mobile jika search aktif) */}
                    <div className="min-w-0 flex-1 md:flex-initial flex items-center gap-2.5 sm:gap-3">
                        {/* Logo Toko — Selalu Tampil */}
                        <Link href={route('home')} className="shrink-0 group">
                            <div
                                className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                                style={{
                                    background: 'color-mix(in srgb, var(--header-active) 20%, transparent)',
                                    boxShadow: '0 0 0 1px color-mix(in srgb, var(--header-active) 40%, transparent), 0 2px 8px color-mix(in srgb, var(--header-active) 25%, transparent)',
                                }}
                            >
                                <img
                                    src={logoUrl}
                                    alt={shopName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                        </Link>

                        {/* Di Mobile: Saat search aktif, gantikan HANYA Nama Toko dengan Search Input yang melebar */}
                        {isMobileSearchOpen && (
                            <div
                                ref={mobileSearchContainerRef}
                                className="flex md:hidden flex-1 items-center min-w-0 pr-1 animate-in fade-in zoom-in-95 duration-200"
                            >
                                <form onSubmit={handleSearch} className="relative w-full flex items-center">
                                    <Search className="absolute left-3 w-3.5 h-3.5 text-header-text/50 pointer-events-none" />
                                    <input
                                        ref={mobileInputRef}
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari produk..."
                                        className="w-full pl-8 pr-8 py-1.5 text-xs sm:text-sm rounded-full border focus:outline-none placeholder:text-header-text/45 text-header-text transition-all [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                                        style={{
                                            backgroundColor: 'color-mix(in srgb, var(--header-text, #FFFFFF) 14%, transparent)',
                                            borderColor: 'color-mix(in srgb, var(--header-text, #FFFFFF) 25%, transparent)',
                                        }}
                                    />
                                    {/* Tombol X di dalam input: menutup pencarian & kembali normal */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMobileSearchOpen(false);
                                            clearSearch();
                                        }}
                                        className="absolute right-2 text-header-text/70 hover:text-white p-1 rounded-full transition hover:bg-white/10"
                                        aria-label="Tutup pencarian"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Nama Toko (sembunyi di mobile HANYA saat search aktif, tetap tampil di desktop) */}
                        <Link
                            href={route('home')}
                            className={`${isMobileSearchOpen ? 'hidden md:inline-block' : 'inline-block'} min-w-0 truncate`}
                        >
                            <span
                                className="text-sm sm:text-base font-bold text-header-text tracking-tight truncate max-w-43.75 xs:max-w-55 sm:max-w-65 md:max-w-70 lg:max-w-sm block"
                                title={shopName}
                            >
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
                                            ? 'shadow-sm font-bold'
                                            : 'text-header-text/75 hover:text-header-text hover:bg-white/10'
                                    }`}
                                    style={item.active ? {
                                        background: 'var(--header-active)',
                                        color: 'var(--header-active-contrast)',
                                        boxShadow: '0 2px 12px color-mix(in srgb, var(--header-active) 40%, transparent)',
                                    } : {}}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Right: Search + Cart + Auth */}
                        <div className="hidden md:flex items-center gap-2.5 shrink-0">
                            {/* Desktop Search Input */}
                            <form onSubmit={handleSearch} className="relative flex items-center">
                                <Search className="absolute left-3 w-3.5 h-3.5 text-header-text/50 pointer-events-none" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="w-36 lg:w-48 focus:w-60 pl-8 pr-7 py-1.5 text-xs rounded-full border transition-all duration-300 placeholder:text-header-text/45 text-header-text focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--header-text, #FFFFFF) 10%, transparent)',
                                        borderColor: 'color-mix(in srgb, var(--header-text, #FFFFFF) 20%, transparent)',
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-2 text-header-text/60 hover:text-header-text p-0.5 rounded-full"
                                        aria-label="Hapus pencarian"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </form>

                            {user ? (
                                <>
                                    <Link
                                        href={route('cart.index')}
                                        id="header-cart-link"
                                        className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/80 hover:text-white hover:bg-white/10 transition"
                                        aria-label={`Keranjang Belanja ${cartCount > 0 ? `(${cartCount} item)` : ''}`}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartCount > 0 && (
                                            <span
                                                className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-black text-white flex items-center justify-center shadow-md leading-none animate-in zoom-in-75 duration-200"
                                                style={{ backgroundColor: 'var(--price-color, #E63854)' }}
                                            >
                                                {cartCount > 99 ? '99+' : cartCount}
                                            </span>
                                        )}
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
                                                background: 'var(--header-active)',
                                                color: 'var(--header-active-contrast)',
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
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full font-bold transition-all hover:opacity-90 hover:scale-[1.03]"
                                        style={{
                                            background: 'var(--header-active)',
                                            color: 'var(--header-active-contrast)',
                                            boxShadow: '0 2px 12px color-mix(in srgb, var(--header-active) 40%, transparent)',
                                        }}
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        <span>Daftar</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Right: Search button (hanya tampil saat search tertutup) + Cart + Profile */}
                        <div className="flex md:hidden items-center gap-1 shrink-0">
                            {!isMobileSearchOpen && (
                                <button
                                    type="button"
                                    onClick={() => setIsMobileSearchOpen(true)}
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/90 hover:text-white hover:bg-white/10 transition animate-in fade-in duration-150"
                                    aria-label="Cari Produk"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            )}

                            {user ? (
                                <Link
                                    href={route('cart.index')}
                                    id="header-mobile-cart-link"
                                    className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/90 hover:text-white hover:bg-white/10 transition"
                                    aria-label={`Keranjang Belanja ${cartCount > 0 ? `(${cartCount} item)` : ''}`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-black text-white flex items-center justify-center shadow-md leading-none animate-in zoom-in-75 duration-200"
                                            style={{ backgroundColor: 'var(--price-color, #E63854)' }}
                                        >
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('login')}
                                    id="header-mobile-cart-link"
                                    className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-header-text/90 hover:text-white hover:bg-white/10 transition"
                                    aria-label="Keranjang Belanja"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            )}
                            {user ? (
                                <Link
                                    href={route('profile.edit')}
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl transition hover:bg-white/10"
                                    aria-label="Profil Akun"
                                >
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: 'var(--header-active)',
                                            color: 'var(--header-active-contrast)',
                                        }}
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
