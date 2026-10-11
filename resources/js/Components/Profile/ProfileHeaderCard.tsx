import React from 'react';
import { User } from '@/types';
import { BadgeCheck, ShieldAlert, Sparkles, User as UserIcon } from 'lucide-react';

interface ProfileHeaderCardProps {
    user: User;
    className?: string;
}

export default function ProfileHeaderCard({ user, className = '' }: ProfileHeaderCardProps) {
    const initials = user.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'U';

    const isVerified = Boolean(user.email_verified_at);

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm ${className}`}>
            {/* Shopee-style Decorative Top Banner */}
            <div className="h-24 sm:h-28 bg-gradient-to-r from-header-bg via-gray-800 to-header-bg relative">
                <div className="absolute inset-0 bg-white/5 opacity-50 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Profile Content */}
            <div className="px-5 pb-5 pt-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 mb-4">
                    {/* Avatar */}
                    <div className="relative inline-block self-start">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-accent-600 to-accent-400 border-4 border-white shadow-md flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl select-none">
                            {initials}
                        </div>
                        {isVerified && (
                            <div
                                className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow"
                                title="Akun Terverifikasi"
                            >
                                <BadgeCheck className="w-5 h-5 text-accent-600 fill-accent-100" />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                {user.name}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
