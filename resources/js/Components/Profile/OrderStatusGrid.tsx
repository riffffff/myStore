import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, CreditCard, Package, Star, Truck } from 'lucide-react';

interface OrderStatusGridProps {
    className?: string;
}

export default function OrderStatusGrid({ className = '' }: OrderStatusGridProps) {
    const statuses = [
        {
            label: 'Belum Bayar',
            icon: CreditCard,
            href: route('orders.track'),
            badge: null,
            color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-100',
        },
        {
            label: 'Dikemas',
            icon: Package,
            href: route('orders.track'),
            badge: null,
            color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
        },
        {
            label: 'Dikirim',
            icon: Truck,
            href: route('orders.track'),
            badge: null,
            color: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100',
        },
        {
            label: 'Beri Nilai',
            icon: Star,
            href: route('orders.track'),
            badge: null,
            color: 'text-accent-600 bg-accent-50 group-hover:bg-accent-100',
        },
    ];

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900 text-base">Pesanan Saya</h3>
                </div>
                <Link
                    href={route('orders.track')}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-accent-700 transition-colors"
                >
                    <span>Lacak Pesanan</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Shopee-style 4-column Status Grid */}
            <div className="grid grid-cols-4 divide-x divide-gray-50 py-4 px-2">
                {statuses.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group flex flex-col items-center justify-center p-2 text-center transition-all hover:-translate-y-0.5"
                        >
                            <div className={`relative p-3 rounded-2xl transition-colors ${item.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="mt-2 text-xs font-medium text-gray-700 group-hover:text-gray-900 line-clamp-1">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
