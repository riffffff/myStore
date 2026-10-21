import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, UserPlus, LogIn, LogOut, ShoppingCart } from 'lucide-react';
import WhatsAppButton from '@/Components/Public/WhatsAppButton';
import { PageProps } from '@/types';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    waNumber: string;
    onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export default function MobileMenu({ isOpen, onClose, user, waNumber, onAuthModalOpen }: MobileMenuProps) {
    if (!isOpen) return null;

    const { cart } = usePage<PageProps>().props as any;
    const cartCount = Number(cart?.total_quantity ?? 0);

    const navItems = [
        { href: route('home'), label: 'Beranda', active: route().current('home') },
        { href: route('products.index'), label: 'Katalog Produk', active: route().current('products.*') },
        { href: route('articles.index'), label: 'Artikel & Info', active: route().current('articles.*') },
        { href: route('orders.track'), label: 'Lacak Pesanan', active: route().current('orders.track') },
    ];

    return (
        <div
            className="md:hidden fixed inset-0 z-50 bg-primary-950/95 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-primary-900 shadow-2xl p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <div className="flex justify-end mb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-primary-800 transition"
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* User info */}
                {user && (
                    <div className="mb-6 pb-6 border-b border-primary-800">
                        <p className="text-xs text-gray-500 mb-1">Masuk sebagai</p>
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="space-y-1 mb-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition ${
                                item.active
                                    ? 'bg-accent-500 text-primary-900'
                                    : 'text-gray-300 hover:bg-primary-800 hover:text-white'
                            }`}
                            onClick={onClose}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            href={route('cart.index')}
                            className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-primary-800 hover:text-white transition"
                            onClick={onClose}
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                <span>Keranjang Belanja</span>
                            </div>
                            {cartCount > 0 && (
                                <span className="bg-accent-500 text-primary-950 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    )}
                </nav>

                {/* Auth buttons */}
                {user ? (
                    <div className="space-y-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary-800 text-gray-300 hover:bg-primary-700 hover:text-white font-semibold transition"
                            onClick={onClose}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => {
                                onAuthModalOpen('login');
                                onClose();
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary-800 text-white font-semibold hover:bg-primary-700 transition"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>Masuk</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onAuthModalOpen('register');
                                onClose();
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-accent-500 text-primary-900 font-bold hover:bg-accent-400 transition"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Daftar Akun</span>
                        </button>
                    </div>
                )}

                <div className="pt-2">
                    <WhatsAppButton
                        href={`https://wa.me/${waNumber}`}
                        fullWidth
                        size="sm"
                    >
                        Hubungi Kami via WhatsApp
                    </WhatsAppButton>
                </div>
            </div>
        </div>
    );
}
