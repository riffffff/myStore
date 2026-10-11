import { Link } from '@inertiajs/react';
import { Home, Newspaper, Package, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
    user?: any;
    onAuthModalOpen?: (mode: 'login' | 'register') => void;
}

export default function BottomNav({ user, onAuthModalOpen }: BottomNavProps) {
    const navItems = [
        { href: route('home'), label: 'Beranda', active: route().current('home'), icon: Home },
        { href: route('products.index'), label: 'Produk', active: route().current('products.*'), icon: ShoppingBag },
        { href: route('articles.index'), label: 'Artikel', active: route().current('articles.*'), icon: Newspaper },
        { href: route('orders.track'), label: 'Pesanan', active: route().current('orders.*'), icon: Package },
    ];

    return (
        <nav
            className="md:hidden fixed inset-x-0 z-40 bg-white border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
            style={{ bottom: '-1px' }}
            aria-label="Navigasi utama"
        >
            <div className="grid h-16 grid-cols-4 items-center px-2 max-w-md mx-auto">
                {navItems.map(({ href, label, active, icon: Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        className="relative flex flex-col items-center justify-center h-full gap-0.5 transition-all duration-200"
                        aria-current={active ? 'page' : undefined}
                    >
                        {/* Pill background for active item */}
                        {active && (
                            <span
                                className="absolute inset-x-2 top-2.5 bottom-2.5 rounded-xl"
                                style={{
                                    background: 'color-mix(in srgb, var(--header-active, #0D9488) 12%, transparent)',
                                }}
                            />
                        )}

                        <span className="relative flex flex-col items-center gap-0.5">
                            <Icon
                                className="h-5 w-5 transition-all duration-200"
                                style={{
                                    color: active ? 'var(--header-active, #0D9488)' : '#9CA3AF',
                                    strokeWidth: active ? 2.5 : 1.8,
                                }}
                                aria-hidden="true"
                            />
                            <span
                                className="text-[10px] font-semibold tracking-tight transition-colors duration-200"
                                style={active ? { color: 'var(--header-active, #0D9488)' } : { color: '#9CA3AF' }}
                            >
                                {label}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
            {/* Menutup celah safe-area di bawah layar */}
            <div className="bg-white" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
        </nav>
    );
}
