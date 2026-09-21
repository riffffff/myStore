import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Menu, LogIn, UserPlus, LogOut } from 'lucide-react';

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
        { href: route('products.index'), label: 'Katalog Produk', active: route().current('products.*') },
        { href: route('articles.index'), label: 'Artikel & Info', active: route().current('articles.*') },
    ];

    return (
        <header className="sticky top-0 z-40 bg-primary-800 shadow-lg">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo & Nama Toko */}
                    <div className="shrink-0 flex items-center">
                        <Link href={route('home')} className="flex items-center gap-3 group">
                            <div className="h-11 w-11 rounded-xl overflow-hidden bg-accent-500/20 ring-1 ring-accent-500/30 flex items-center justify-center shrink-0 transition group-hover:ring-accent-500/50">
                                <img
                                    src={logoUrl}
                                    alt={shopName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                {shopName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                                    item.active
                                        ? 'bg-accent-500 text-primary-900'
                                        : 'text-gray-300 hover:bg-primary-700 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Right: Cart + Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <Link
                                    href={route('cart.index')}
                                    className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-primary-700 transition"
                                    aria-label="Keranjang Belanja"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                                <span className="text-xs text-gray-400 max-w-32 truncate">
                                    Hai, <span className="font-semibold text-white">{user.name}</span>
                                </span>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-primary-700 transition font-semibold"
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
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-gray-300 hover:text-white hover:bg-primary-700 transition font-semibold"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Masuk</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('register')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-lg bg-accent-500 text-primary-900 hover:bg-accent-400 font-bold shadow-sm transition"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Daftar</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile: Cart + Hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        {user && (
                            <Link
                                href={route('cart.index')}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-primary-700 transition"
                                aria-label="Keranjang Belanja"
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={onMenuToggle}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-primary-700 transition"
                            aria-label="Menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
