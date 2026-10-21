import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import ProfileHeaderCard from '@/Components/Profile/ProfileHeaderCard';

import ProfileMenuItem from '@/Components/Profile/ProfileMenuItem';
import ProfileSectionCard from '@/Components/Profile/ProfileSectionCard';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import {
    ChevronRight,
    Headphones,
    KeyRound,
    Lock,
    LogOut,
    MessageCircle,
    Shield,
    ShieldAlert,
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

    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');

    if (!user) {
        return null;
    }

    return (
        <PublicLayout>
            <Head title={`Profil Saya - ${shopName}`} />

            <div className="bg-gray-50/60 min-h-screen py-8 sm:py-12 pb-24 md:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Breadcrumbs / Page Heading */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 px-1">
                        <Link href={route('home')} className="hover:text-accent-700 transition font-medium">
                            Beranda
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-bold">Akun Saya</span>
                    </div>

                    {/* Desktop & Mobile Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* LEFT COLUMN: Profile Header + Shopee Menus */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Profile Header Card */}
                            <ProfileHeaderCard user={user} />



                            {/* Navigation / Shopee Menu Card */}
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
                                            icon={MessageCircle}
                                            iconBg="bg-accent-50"
                                            iconColor="text-accent-600"
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

                        {/* RIGHT COLUMN: Desktop Order Status Grid + Active Form Card */}
                        <div className="lg:col-span-8 space-y-5">


                            {/* Tab Forms Content */}
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
