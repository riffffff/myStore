import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { LogIn, UserPlus, Mail, Lock, User, Phone, X, Loader2 } from 'lucide-react';
import Button from '@/Components/Button';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);

    // Form Login
    const loginForm = useForm({
        login: '',
        password: '',
        remember: true,
    });

    // Form Register
    const registerForm = useForm({
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => {
                loginForm.reset('password');
                onClose();
            },
        });
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onSuccess: () => {
                registerForm.reset('password', 'password_confirmation');
                onClose();
            },
        });
    };

    const switchMode = (newMode: 'login' | 'register') => {
        setMode(newMode);
        loginForm.clearErrors();
        registerForm.clearErrors();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-2xl transition-all border border-stone-200/80 animate-in zoom-in-95 duration-200">
                    {/* Header Modal */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                        <div className="flex items-center gap-2">
                            {mode === 'login' ? (
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60">
                                    <LogIn className="h-5 w-5" />
                                </div>
                            ) : (
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                            )}
                            <div>
                                <DialogTitle as="h3" className="text-lg font-bold text-stone-900">
                                    {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
                                </DialogTitle>
                                <p className="text-xs text-stone-500">
                                    {mode === 'login'
                                        ? 'Silakan masuk untuk mengelola pesanan & keranjang Anda'
                                        : 'Buat akun dalam hitungan detik untuk mulai belanja'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => switchMode('login')}
                            className={`py-2 rounded-lg transition ${
                                mode === 'login'
                                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                                    : 'text-stone-500 hover:text-stone-800'
                            }`}
                        >
                            Masuk / Login
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode('register')}
                            className={`py-2 rounded-lg transition ${
                                mode === 'register'
                                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                                    : 'text-stone-500 hover:text-stone-800'
                            }`}
                        >
                            Daftar Akun
                        </button>
                    </div>

                    {/* Form Login */}
                    {mode === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Nomor Handphone / Email
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="text"
                                        required
                                        value={loginForm.data.login}
                                        onChange={(e) => loginForm.setData('login', e.target.value)}
                                        placeholder="08123456789 atau nama@email.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {(loginForm.errors.login || (loginForm.errors as any).email) && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {loginForm.errors.login || (loginForm.errors as any).email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="password"
                                        required
                                        value={loginForm.data.password}
                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {loginForm.errors.password && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {loginForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                                    <input
                                        type="checkbox"
                                        checked={loginForm.data.remember}
                                        onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                                    />
                                    <span>Ingat saya</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={loginForm.processing}
                                loadingText="Memproses..."
                                fullWidth
                                className="mt-2"
                                leftIcon={<LogIn className="h-4 w-4" />}
                            >
                                Masuk Sekarang
                            </Button>
                        </form>
                    ) : (
                        /* Form Register */
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="text"
                                        required
                                        value={registerForm.data.name}
                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                        placeholder="Nama Lengkap"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {registerForm.errors.name && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {registerForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Nomor Handphone (WhatsApp)
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="tel"
                                        required
                                        value={registerForm.data.phone}
                                        onChange={(e) => registerForm.setData('phone', e.target.value)}
                                        placeholder="081234567890"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {registerForm.errors.phone && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {registerForm.errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Alamat Email <span className="text-stone-400 font-normal lowercase">(opsional)</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="email"
                                        value={registerForm.data.email}
                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {registerForm.errors.email && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {registerForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="password"
                                        required
                                        value={registerForm.data.password}
                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {registerForm.errors.password && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {registerForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <input
                                        type="password"
                                        required
                                        value={registerForm.data.password_confirmation}
                                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi kata sandi"
                                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition"
                                    />
                                </div>
                                {registerForm.errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                        {registerForm.errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={registerForm.processing}
                                loadingText="Mendaftarkan..."
                                fullWidth
                                className="mt-2"
                                leftIcon={<UserPlus className="h-4 w-4" />}
                            >
                                Daftar Akun
                            </Button>
                        </form>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
