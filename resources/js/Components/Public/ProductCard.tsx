import React, { useState, memo, useCallback } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Product, StockStatus } from '@/types/store';
import { ShoppingCart, Check, Banknote } from 'lucide-react';
import { formatRupiah, getPrimaryImageUrl } from '@/lib/utils';
import { PageProps } from '@/types';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800';

interface ProductCardProps {
    product: Product;
    whatsappNumber: string;
    whatsappTemplate: string;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
    const { auth } = usePage<PageProps>().props as any;
    const user = auth?.user;

    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const productName        = product?.name ?? 'Produk';
    const productSlug        = product?.slug ?? '';
    const productPrice       = product?.price ?? 0;
    const productStockStatus = product?.stock_status ?? 'preorder';
    const productImages      = Array.isArray(product?.images) ? product.images : [];
    const productId          = product?.id;

    const imageUrl = getPrimaryImageUrl(productImages, DEFAULT_PRODUCT_IMG);
    const formattedPrice = formatRupiah(productPrice);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.visit(route('products.show', productSlug));
            return;
        }
        setIsAdding(true);
        router.post(
            route('cart.store'),
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAdding(false);
                    setIsAdded(true);
                    setTimeout(() => setIsAdded(false), 2000);
                },
                onError: () => setIsAdding(false),
            }
        );
    }, [user, productSlug, productId]);

    const handleBuyNow = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.visit(route('orders.create', { product_id: productId, quantity: 1 }));
    }, [productId]);

    const status = productStockStatus as StockStatus;
    const numericPrice = formattedPrice.replace(/^Rp\s?/, '');
    const views = product?.views_count ?? 0;
    const disabled = status === 'out_of_stock';

    const btnBase =
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium ' +
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
        'focus-visible:ring-accent-600 disabled:pointer-events-none disabled:opacity-50 ' +
        'active:scale-[0.98] select-none cursor-pointer';

    const btnSecondary =
        'border border-accent-200 bg-accent-50 text-accent-800 hover:bg-accent-100 shadow-sm';

    const btnPrimary =
        'bg-accent-600 text-white hover:bg-accent-700 shadow-sm';

    const btnSuccess =
        'bg-accent-600 text-white hover:bg-accent-700 shadow-sm';

    const btnDisabledCls =
        'bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none hover:bg-gray-200';

    const btnSizeMobile = 'h-8 w-8 sm:h-9 sm:w-auto sm:px-4';

    return (
        <div
            className="group rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border bg-white"
            style={{
                backgroundColor: 'var(--color-card-product-bg, #ffffff)',
                borderColor: 'var(--color-card-product-border, #e5e7eb)',
                color: 'var(--color-card-product-text, #1c1917)',
            }}
        >
            <Link href={route('products.show', productSlug)} className="flex flex-col cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 z-10">
                        {status === 'available' ? (
                            <span className="bg-accent-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase tracking-wider inline-flex items-center gap-1">
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" /> Tersedia
                            </span>
                        ) : status === 'out_of_stock' ? (
                            <span className="bg-rose-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                                Habis
                            </span>
                        ) : (
                            <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                                Pre-Order
                            </span>
                        )}
                    </div>

                    {views > 20 && (
                        <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 z-10">
                            <span className="bg-stone-900/75 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                                Populer
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-2 sm:p-5 flex flex-col grow justify-between">
                    <div>
                        {product?.category && (
                            <span className="text-[9px] sm:text-[11px] uppercase font-bold text-accent-700 block mb-0.5 sm:mb-1 tracking-wider opacity-90 truncate">
                                {product.category.replace(/_/g, ' ')}
                            </span>
                        )}
                        <h3
                            className="text-[11px] sm:text-base font-bold line-clamp-2 leading-snug group-hover:text-accent-700 transition-colors min-h-[1.9rem] sm:min-h-[2.6rem]"
                            style={{ color: 'var(--color-card-product-text)' }}
                            title={productName}
                        >
                            {productName}
                        </h3>
                    </div>

                    <div className="mt-1.5 sm:mt-4 pt-1.5 sm:pt-3 border-t border-gray-100 flex items-baseline justify-between gap-1">
                        <div className="flex items-baseline font-black tracking-tight" style={{ color: 'var(--color-card-product-price, #e11d48)' }}>
                            <span className="text-[9px] sm:text-xs font-bold mr-0.5">Rp</span>
                            <span className="text-xs sm:text-lg md:text-xl font-black leading-none">{numericPrice}</span>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-2 sm:px-5 pb-2 sm:pb-5 mt-auto">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* TOMBOL 1: Masukkan Keranjang (secondary hijau) */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={disabled || isAdding}
                        className={`${btnBase} flex-1 ${
                            disabled || isAdding
                                ? btnDisabledCls
                                : isAdded
                                ? btnSuccess
                                : btnSecondary
                        }`}
                        style={{ fontSize: '10px', padding: '0.35rem 0.25rem' }}
                        title="Masukkan ke Keranjang"
                        aria-label="Masukkan ke Keranjang"
                    >
                        {isAdded ? (
                            <Check className="w-3.5 h-3.5 shrink-0 sm:hidden" />
                        ) : (
                            <ShoppingCart className="w-3.5 h-3.5 shrink-0 sm:hidden" />
                        )}
                        <span className="hidden sm:inline truncate">
                            {isAdded ? 'Ditambah' : 'Keranjang'}
                        </span>
                        <span className="sm:hidden font-bold truncate">
                            {isAdded ? '✓' : 'Keranjang'}
                        </span>
                    </button>

                    {/* TOMBOL 2: Beli (primary hijau) — klik LANGSUNG ke HALAMAN TRANSAKSI (bukan WA) */}
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={disabled}
                        className={`${btnBase} flex-1 ${disabled ? btnDisabledCls : btnPrimary}`}
                        style={{ fontSize: '10px', padding: '0.35rem 0.25rem' }}
                        title="Beli Sekarang"
                        aria-label="Beli Sekarang"
                    >
                        <Banknote className="w-3.5 h-3.5 shrink-0 sm:hidden" />
                        <span className="hidden sm:inline truncate">Beli</span>
                        <span className="sm:hidden font-bold truncate">Beli</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
