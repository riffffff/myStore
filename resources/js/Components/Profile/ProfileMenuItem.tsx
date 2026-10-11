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
    iconColor = 'text-gray-700',
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
            className={`flex items-center justify-between p-4 transition-colors rounded-xl ${
                active
                    ? 'bg-accent-50/70 border-l-4 border-accent-600'
                    : 'hover:bg-gray-50/80'
            } ${className}`}
        >
            <div className="flex items-center gap-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${iconBg} ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                    <p className={`text-sm font-semibold truncate ${active ? 'text-accent-800' : 'text-gray-800'}`}>
                        {title}
                    </p>
                    {subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{subtitle}</p>}
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
