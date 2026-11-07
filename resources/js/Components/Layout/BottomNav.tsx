import { Link } from '@inertiajs/react';
import { Home, Newspaper, Package, ShoppingBag, LayoutDashboard } from 'lucide-react';

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
        ...(Boolean(user?.is_admin) ? [
            { href: '/admin', label: 'Admin', active: false, icon: LayoutDashboard }
        ] : []),
    ];

    return (
        <nav
            className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t pb-[max(env(safe-area-inset-bottom,4px),4px)] shadow-lg transition-colors"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--color-card-product-bg, #FFFDF7) 94%, transparent)',
                borderColor: 'var(--color-card-product-border, #EBD9AC)',
            }}
            aria-label="Navigasi utama"
        >
            <div className="flex items-stretch w-full pt-1 px-1 max-w-md mx-auto">
                {navItems.map(({ href, label, active, icon: Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        className="flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 rounded-xl text-[10px] font-bold transition"
                        aria-current={active ? 'page' : undefined}
                    >
                        <div
                            className={`p-1.5 rounded-lg transition mb-0.5 ${
                                active ? 'shadow-xs' : ''
                            }`}
                            style={active ? {
                                backgroundColor: 'var(--color-primary, #6E4F78)',
                                color: 'var(--color-primary-contrast, #FFFFFF)',
                            } : {
                                color: 'var(--color-neutral-subtle, #8C7A92)',
                            }}
                        >
                            <Icon
                                className="w-4.5 h-4.5 transition-transform duration-200"
                                strokeWidth={active ? 2.4 : 1.8}
                                aria-hidden="true"
                            />
                        </div>
                        <span
                            className="truncate max-w-14 text-[10px] font-bold transition-colors duration-200"
                            style={active ? { color: 'var(--color-primary, #6E4F78)' } : { color: 'var(--color-neutral-subtle, #8C7A92)' }}
                        >
                            {label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
