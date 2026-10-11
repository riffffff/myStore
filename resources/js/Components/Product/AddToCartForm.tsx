import React, { useState, useCallback, memo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { ShoppingCart, UserPlus, LogIn, Lock, Minus, Plus, AlertCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import WhatsAppButton from '@/Components/Public/WhatsAppButton';

interface AddToCartFormProps {
    productId: number;
    productPrice: number;
    isLoggedIn: boolean;
    isOutOfStock: boolean;
    whatsappUrl: string;
    onAuthModalOpen: (mode: 'login' | 'register') => void;
}

/**
 * Add to cart form with quantity selector and action buttons
 * Memoized to prevent unnecessary re-renders when parent updates
 */
const AddToCartForm = memo(function AddToCartForm({
    productId,
    productPrice,
    isLoggedIn,
    isOutOfStock,
    whatsappUrl,
    onAuthModalOpen,
}: AddToCartFormProps) {
    const [qty, setQty] = useState<number>(1);

    const { setData, post, processing, errors, reset } = useForm({
        product_id: productId,
        quantity: 1,
    });

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setData('product_id', productId);
            setData('quantity', Math.max(1, qty));
            post(route('cart.store'), { onFinish: () => reset() });
        },
        [productId, qty, setData, post, reset]
    );

    const handleQtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseInt(e.target.value, 10);
        setQty(Number.isFinite(v) && v > 0 ? Math.min(100, v) : 1);
    }, []);

    const decrementQty = useCallback(() => {
        setQty((v) => Math.max(1, v - 1));
    }, []);

    const incrementQty = useCallback(() => {
        setQty((v) => Math.min(100, v + 1));
    }, []);

    // Not logged in - show auth prompt
    if (!isLoggedIn) {
        return (
            <div className="pt-2 space-y-3">
                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50">
                    <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-stone-200/80 text-stone-800 shrink-0">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-bold text-stone-900">
                                    Silakan Masuk untuk Memesan
                                </p>
                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                    Gunakan akun Anda untuk langsung memesan produk ini dengan mudah.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('login')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-600 text-white text-xs font-semibold hover:bg-accent-700 transition shadow-xs"
                                >
                                    <LogIn className="h-3.5 w-3.5" />
                                    <span>Masuk</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('register')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-semibold hover:bg-stone-100 transition"
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span>Daftar Akun</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <WhatsAppButton href={whatsappUrl} fullWidth className="py-3 text-sm font-semibold rounded-xl">
                    Tanya Produk via WhatsApp
                </WhatsAppButton>
            </div>
        );
    }

    // Logged in - show cart form
    return (
        <form onSubmit={handleSubmit} className="pt-2 space-y-4">
            {/* Box Jumlah & Subtotal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-2xs">
                {/* Quantity Selector */}
                <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                        Jumlah Produk
                    </span>
                    <div className="inline-flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white shadow-2xs h-10">
                        <button
                            type="button"
                            onClick={decrementQty}
                            className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 transition disabled:opacity-30 disabled:hover:bg-transparent shrink-0"
                            disabled={qty <= 1}
                            aria-label="Kurangi jumlah"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={qty}
                            onChange={handleQtyChange}
                            className="w-14 h-full text-center font-bold text-stone-900 text-sm border-x border-stone-200 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Jumlah produk"
                        />
                        <button
                            type="button"
                            onClick={incrementQty}
                            className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 transition shrink-0"
                            aria-label="Tambah jumlah"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Subtotal */}
                <div className="flex flex-col sm:items-end justify-center">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                        Subtotal
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight leading-none">
                        {formatRupiah(productPrice * qty)}
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {errors?.product_id && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{errors.product_id}</span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Beli Sekarang (Direct Checkout) */}
                    <Link
                        href={route('orders.create', { product_id: productId, quantity: qty })}
                        className={`inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition active:scale-[0.99] text-center ${
                            isOutOfStock
                                ? 'bg-stone-200 text-stone-400 pointer-events-none'
                                : 'bg-accent-600 text-white hover:bg-accent-700'
                        }`}
                    >
                        Beli Sekarang
                    </Link>

                    {/* Tambah ke Keranjang */}
                    <button
                        type="submit"
                        disabled={isOutOfStock || processing}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border-2 shadow-2xs transition active:scale-[0.99] ${
                            isOutOfStock
                                ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                                : 'bg-white hover:bg-accent-50/50 border-accent-600 text-accent-700'
                        }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                            {isOutOfStock ? 'Stok Habis' : processing ? 'Menambahkan...' : '+ Keranjang'}
                        </span>
                    </button>
                </div>

                {/* WhatsApp Button */}
                <WhatsAppButton href={whatsappUrl} fullWidth className="py-3 text-sm font-semibold rounded-xl">
                    Tanya via WhatsApp
                </WhatsAppButton>
            </div>
        </form>
    );
});

export default AddToCartForm;
