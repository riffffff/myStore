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
            <div className="px-6 pb-6 pt-0 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-6">
                    {/* Avatar Container: Pulled up independently */}
                    <div className="relative shrink-0 -mt-10 sm:-mt-12 z-10">
                        <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-accent-600 to-accent-400 border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-2xl sm:text-4xl select-none">
                            {initials}
                        </div>
                        {isVerified && (
                            <div
                                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-50"
                                title="Akun Terverifikasi"
                            >
                                <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-accent-600 fill-accent-100" />
                            </div>
                        )}
                    </div>

                    {/* User Info Container: Normal flow, no pull-up to avoid overlap */}
                    <div className="flex-1 min-w-0 py-1 sm:py-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl sm:text-3xl font-black text-gray-900 truncate tracking-tight">
                                {user.name}
                            </h2>
                        </div>
                        <p className="text-sm sm:text-lg text-gray-500 truncate mt-1 sm:mt-2 font-medium">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
