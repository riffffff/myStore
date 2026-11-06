import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import ProfileHeaderCard from '@/Components/Profile/ProfileHeaderCard';
import ProfileMenuItem from '@/Components/Profile/ProfileMenuItem';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import ProfileSectionCard from '@/Components/Profile/ProfileSectionCard';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import {
    ChevronRight,
    KeyRound,
    LogOut,
    Shield,
    Trash2,
    User as UserIcon,
} from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { shopSettings, auth } = usePage<PageProps>().props;
    const user = auth?.user;
    const shopName = shopSettings?.shop_name || 'Toko';
    const waNumber = shopSettings?.whatsapp_number || '6281234567890';
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Halo ${shopName}, saya memerlukan bantuan terkait akun saya (${user?.name} - ${user?.email}).`
    )}`;

    // Tab untuk tampilan desktop (side-by-side)
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');

    // Accordion expand/collapse di tampilan mobile
    const [expandedMobile, setExpandedMobile] = useState<'profile' | 'password' | 'danger' | null>(null);

    const toggleMobileAccordion = (tab: 'profile' | 'password' | 'danger') => {
        setExpandedMobile((prev) => (prev === tab ? null : tab));
    };

    if (!user) {
        return null;
    }

    return (
        <PublicLayout>
            <Head title={`Profil Saya - ${shopName}`} />

            <div className="bg-gray-50/60 min-h-screen py-8 sm:py-12 pb-24 md:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 px-1">
                        <Link href={route('home')} className="hover:text-accent-700 transition font-medium">
                            Beranda
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-bold">Akun Saya</span>
                    </div>

                    {/* ── MOBILE VIEW (< lg): Accordion Expand In-place ── */}
                    <div className="block lg:hidden space-y-4">
                        {/* Profile Header Card */}
                        <ProfileHeaderCard user={user} />

                        {/* Accordion Menu Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 divide-y divide-gray-50">
                            <div className="space-y-2 pb-4">
                                <p className="px-3 pt-2 text-[11px] font-extrabold tracking-widest text-gray-400 uppercase mb-2">
                                    Pengaturan Akun
                                </p>

                                {/* 1. Informasi Pribadi */}
                                <div className="rounded-2xl transition-all">
                                    <ProfileMenuItem
                                        icon={UserIcon}
                                        iconBg="bg-accent-50"
                                        iconColor="text-accent-600"
                                        title="Informasi Pribadi"
                                        subtitle="Nama & Alamat Email"
                                        isExpanded={expandedMobile === 'profile'}
                                        onClick={() => toggleMobileAccordion('profile')}
                                    />
                                    {expandedMobile === 'profile' && (
                                        <div className="mt-2.5 p-4 bg-gray-50/90 rounded-2xl border border-gray-100 shadow-2xs">
                                            <UpdateProfileInformationForm
                                                mustVerifyEmail={mustVerifyEmail}
                                                status={status}
                                                className="max-w-full"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 2. Keamanan Kata Sandi */}
                                <div className="rounded-2xl transition-all">
                                    <ProfileMenuItem
                                        icon={KeyRound}
                                        iconBg="bg-accent-50"
                                        iconColor="text-accent-600"
                                        title="Keamanan Kata Sandi"
                                        subtitle="Ganti Password"
                                        isExpanded={expandedMobile === 'password'}
                                        onClick={() => toggleMobileAccordion('password')}
                                    />
                                    {expandedMobile === 'password' && (
                                        <div className="mt-2.5 p-4 bg-gray-50/90 rounded-2xl border border-gray-100 shadow-2xs">
                                            <UpdatePasswordForm className="max-w-full" />
                                        </div>
                                    )}
                                </div>

                                {/* 3. Hapus Akun */}
                                <div className="rounded-2xl transition-all">
                                    <ProfileMenuItem
                                        icon={Trash2}
                                        iconBg="bg-rose-50"
                                        iconColor="text-rose-600"
                                        title="Hapus Akun"
                                        subtitle="Tindakan Berbahaya"
                                        isExpanded={expandedMobile === 'danger'}
                                        onClick={() => toggleMobileAccordion('danger')}
                                    />
                                    {expandedMobile === 'danger' && (
                                        <div className="mt-2.5 p-4 bg-rose-50/70 rounded-2xl border border-rose-100 shadow-2xs">
                                            <div className="mb-4 text-xs text-rose-700 leading-relaxed">
                                                Setelah akun Anda dihapus, semua riwayat dan data akun akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                                            </div>
                                            <DeleteUserForm className="max-w-full" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {Boolean((user as any).is_admin) && (
                                <div className="space-y-1.5 py-4">
                                    <p className="px-3 pt-2 text-[11px] font-extrabold tracking-widest text-accent-700 uppercase mb-2">
                                        Administrasi Toko
                                    </p>
                                    <Link href="/admin" className="block">
                                        <ProfileMenuItem
                                            icon={Shield}
                                            iconBg="bg-accent-50"
                                            iconColor="text-accent-600"
                                            title="Admin Panel"
                                            subtitle="Kelola produk, artikel, & toko"
                                        />
                                    </Link>
                                </div>
                            )}

                            <div className="space-y-1.5 py-4">
                                <p className="px-3 pt-2 text-[11px] font-extrabold tracking-widest text-gray-400 uppercase mb-2">
                                    Pusat Bantuan
                                </p>
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <ProfileMenuItem
                                        icon={WhatsAppIcon}
                                        iconBg="bg-emerald-50"
                                        iconColor="text-emerald-600"
                                        title="Chat WhatsApp CS"
                                        subtitle="Konsultasi kendala toko"
                                    />
                                </a>
                            </div>

                            <div className="pt-4">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Keluar dari Akun</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── DESKTOP VIEW (>= lg): 2 Kolom Berdampingan ── */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">
                        {/* LEFT COLUMN: Profile Header + Shopee Menus */}
                        <div className="lg:col-span-4 space-y-4">
                            <ProfileHeaderCard user={user} />

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 divide-y divide-gray-50">
                                <div className="space-y-1.5 pb-4">
                                    <p className="px-3 pt-2 text-[11px] font-extrabold tracking-widest text-gray-400 uppercase mb-2">
                                        Pengaturan Akun
                                    </p>
                                    <ProfileMenuItem
                                        icon={UserIcon}
                                        iconBg="bg-accent-50"
                                        iconColor="text-accent-600"
                                        title="Informasi Pribadi"
                                        subtitle="Nama & Alamat Email"
                                        active={activeTab === 'profile'}
                                        onClick={() => setActiveTab('profile')}
                                    />
                                    <ProfileMenuItem
                                        icon={KeyRound}
                                        iconBg="bg-accent-50"
                                        iconColor="text-accent-600"
                                        title="Keamanan Kata Sandi"
                                        subtitle="Ganti Password"
                                        active={activeTab === 'password'}
                                        onClick={() => setActiveTab('password')}
                                    />
                                    <ProfileMenuItem
                                        icon={Trash2}
                                        iconBg="bg-rose-50"
                                        iconColor="text-rose-600"
                                        title="Hapus Akun"
                                        subtitle="Tindakan Berbahaya"
                                        active={activeTab === 'danger'}
                                        onClick={() => setActiveTab('danger')}
                                    />
                                </div>

                                {Boolean((user as any).is_admin) && (
                                    <div className="space-y-1.5 py-4">
                                        <p className="px-3 pt-2 text-[11px] font-extrabold tracking-widest text-accent-700 uppercase mb-2">
                                            Administrasi Toko
                                        </p>
                                        <Link href="/admin" className="block">
                                            <ProfileMenuItem
                                                icon={Shield}
                                                iconBg="bg-accent-50"
                                                iconColor="text-accent-600"
                                                title="Admin Panel"
                                                subtitle="Kelola produk, artikel, & toko"
                                            />
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-1.5 py-4">
                                    <p className="px-3 pt-2 text-[11px] font-extrabold tracking-widest text-gray-400 uppercase mb-2">
                                        Pusat Bantuan
                                    </p>
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <ProfileMenuItem
                                            icon={WhatsAppIcon}
                                            iconBg="bg-emerald-50"
                                            iconColor="text-emerald-600"
                                            title="Chat WhatsApp CS"
                                            subtitle="Konsultasi kendala toko"
                                        />
                                    </a>
                                </div>

                                <div className="pt-4">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Keluar dari Akun</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Active Form Card */}
                        <div className="lg:col-span-8 space-y-5">
                            {activeTab === 'profile' && (
                                <ProfileSectionCard
                                    title="Informasi Profil"
                                    action={
                                        <span className="text-xs text-gray-400">
                                            Perbarui data akun Anda
                                        </span>
                                    }
                                >
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-3xl"
                                    />
                                </ProfileSectionCard>
                            )}

                            {activeTab === 'password' && (
                                <ProfileSectionCard
                                    title="Keamanan & Kata Sandi"
                                    action={
                                        <span className="text-xs text-gray-400">
                                            Jaga keamanan akun Anda
                                        </span>
                                    }
                                >
                                    <UpdatePasswordForm className="max-w-3xl" />
                                </ProfileSectionCard>
                            )}

                            {activeTab === 'danger' && (
                                <ProfileSectionCard
                                    title="Hapus Akun Pengguna"
                                    action={
                                        <span className="text-xs text-rose-500 font-medium">
                                            Perhatian: Permanen
                                        </span>
                                    }
                                    className="border-rose-100"
                                >
                                    <div className="mb-6 p-5 rounded-2xl bg-rose-50 text-rose-700 text-sm leading-relaxed border border-rose-100/50">
                                        Setelah akun Anda dihapus, semua riwayat dan data akun akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                                    </div>
                                    <DeleteUserForm className="max-w-3xl" />
                                </ProfileSectionCard>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
