import React from 'react';

interface ProfileSectionCardProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function ProfileSectionCard({
    title,
    action,
    children,
    className = '',
}: ProfileSectionCardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    {title && <h3 className="font-semibold text-gray-900 text-base">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
}
