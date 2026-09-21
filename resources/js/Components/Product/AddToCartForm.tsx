import React, { useState, useCallback, memo } from 'react';
import { useForm } from '@inertiajs/react';
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
            <div className="pt-4 space-y-3">
                <div className="p-5 rounded-2xl border border-mahogany-100 bg-mahogany-50/50">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-mahogany-100 text-mahogany-800 shrink-0">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-bold text-stone-900">
                                    Masuk untuk Memesan ke Keranjang
                                </p>
                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                    Silakan masuk atau buat akun untuk menambahkan ke keranjang.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('login')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mahogany-800 text-white text-xs font-bold hover:bg-mahogany-700 transition"
                                >
                                    <LogIn className="h-3.5 w-3.5" />
                                    <span>Masuk</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onAuthModalOpen('register')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-mahogany-200 bg-white text-mahogany-800 text-xs font-bold hover:bg-mahogany-50 transition"
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span>Daftar Akun</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <WhatsAppButton href={whatsappUrl} fullWidth>
                    Tanya / Pesan via WhatsApp
                </WhatsAppButton>
            </div>
        );
    }

    // Logged in - show cart form
    return (
        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end p-4 sm:p-5 rounded-2xl bg-mahogany-50/50 border border-mahogany-100">
                {/* Quantity Selector */}
                <div className="space-y-2.5">
                    <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                        Jumlah Pembelian
                    </label>
                    <div className="inline-flex items-center border border-mahogany-200 rounded-xl overflow-hidden bg-white shadow-sm h-11">
                        <button
                            type="button"
                            onClick={decrementQty}
                            className="w-11 h-full flex items-center justify-center text-mahogany-700 hover:bg-mahogany-50 active:bg-mahogany-100 transition disabled:opacity-40 disabled:hover:bg-transparent shrink-0"
                            disabled={qty <= 1}
                        >
                            <Minus className="w-4.5 h-4.5 stroke-[2.5]" />
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={qty}
                            onChange={handleQtyChange}
                            className="w-16 h-full text-center font-extrabold text-stone-900 text-base border-x border-mahogany-200 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            onClick={incrementQty}
                            className="w-11 h-full flex items-center justify-center text-mahogany-700 hover:bg-mahogany-50 active:bg-mahogany-100 transition shrink-0"
                        >
                            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                        </button>
                    </div>
                </div>

                {/* Total Price */}
                <div className="flex flex-col items-start sm:items-end justify-end space-y-1">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Total Harga
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-mahogany-900 leading-none">
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
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="submit"
                    disabled={isOutOfStock || processing}
                    className={`grow inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm shadow-xs transition ${
                        isOutOfStock
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : 'bg-mahogany-800 text-white hover:bg-mahogany-700 active:scale-[0.98]'
                    }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                        {isOutOfStock ? 'Stok Habis' : processing ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </span>
                </button>

                <WhatsAppButton href={whatsappUrl} className="grow">
                    Pesan via WhatsApp
                </WhatsAppButton>
            </div>
        </form>
    );
});

export default AddToCartForm;
