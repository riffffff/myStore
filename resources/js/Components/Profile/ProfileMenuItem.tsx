import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface ProfileMenuItemProps {
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    title: string;
    subtitle?: string;
    badge?: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
    className?: string;
}

export default function ProfileMenuItem({
    icon: Icon,
    iconColor = 'text-gray-600',
    iconBg = 'bg-gray-100',
    title,
    subtitle,
    badge,
    href,
    onClick,
    active = false,
    className = '',
}: ProfileMenuItemProps) {
    const content = (
        <div
            className={`relative flex items-center justify-between px-4 py-3 transition-all duration-300 rounded-2xl group/item ${
                active
                    ? 'bg-white shadow-md ring-1 ring-black/5'
                    : 'hover:bg-gray-50/80'
            } ${className}`}
        >
            <div className={`flex items-center gap-3.5 min-w-0 transition-all duration-300`}>
                <div className={`p-2.5 rounded-xl shrink-0 transition-all duration-300 ${
                    active 
                        ? (iconColor && iconColor.includes('rose') ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-accent-600 text-white shadow-accent-600/20') + ' shadow-md scale-105' 
                        : (iconBg && iconColor ? `${iconBg} ${iconColor}` : 'bg-gray-100 text-gray-600 group-hover/item:bg-gray-200 group-hover/item:text-gray-800')
                }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                    <p className={`text-[13px] sm:text-sm font-bold truncate transition-colors duration-300 ${
                        active 
                            ? (iconColor && iconColor.includes('rose') ? 'text-rose-900' : 'text-accent-900') 
                            : 'text-gray-700 group-hover/item:text-gray-900'
                    }`}>
                        {title}
                    </p>
                    {subtitle && <p className={`text-[10px] sm:text-[11px] font-medium truncate mt-0.5 transition-colors duration-300 ${
                        active 
                            ? (iconColor && iconColor.includes('rose') ? 'text-rose-700/70' : 'text-accent-700/70') 
                            : 'text-gray-400 group-hover/item:text-gray-500'
                    }`}>{subtitle}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {badge && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-accent-100 text-accent-800">
                        {badge}
                    </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-0.5" />
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="group block focus:outline-none">
                {content}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="group block w-full text-left focus:outline-none"
            >
                {content}
            </button>
        );
    }

    return <div className="group block">{content}</div>;
}
