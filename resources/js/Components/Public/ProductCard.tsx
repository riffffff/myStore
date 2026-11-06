import React, { useState, memo, useCallback } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Product, StockStatus } from '@/types/store';
import { ShoppingCart, Check, ShoppingBag, Loader2 } from 'lucide-react';
import { formatRupiah, getPrimaryImageUrl } from '@/lib/utils';
import { PageProps } from '@/types';
import ProductCornerRibbon from '@/Components/Public/ProductCornerRibbon';

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

    const originalPriceNum = product?.original_price ? Number(product.original_price) : 0;
    const currentPriceNum = product?.price ? Number(product.price) : 0;
    const hasDiscount = originalPriceNum > currentPriceNum;
    const discountPercent = hasDiscount
        ? Math.round(((originalPriceNum - currentPriceNum) / originalPriceNum) * 100)
        : null;

    return (
        <div
            className="group relative rounded-xl sm:rounded-2xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border"
            style={{
                backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                borderColor: 'var(--color-card-product-border, #EBD9AC)',
                color: 'var(--color-card-product-text, #1c1917)',
            }}
        >
            <Link href={route('products.show', productSlug)} className="flex flex-col cursor-pointer relative">
                {/* Ribbon HANYA muncul jika produk memiliki diskon */}
                <ProductCornerRibbon
                    discount={discountPercent ? `${discountPercent}% OFF` : null}
                    className="w-19.5 h-19.5 sm:w-22 sm:h-22"
                />

                <div className="relative aspect-square overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                        <div className="flex flex-col">
                            {hasDiscount && (
                                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                    {formatRupiah(originalPriceNum)}
                                </span>
                            )}
                            <div className="flex items-baseline font-black tracking-tight" style={{ color: 'var(--color-card-product-price, #E63854)' }}>
                                <span className="text-[9px] sm:text-xs font-bold mr-0.5">Rp</span>
                                <span className="text-xs sm:text-lg md:text-xl font-black leading-none">{numericPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-2 sm:px-5 pb-2 sm:pb-5 mt-auto">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* TOMBOL 1: Masukkan Keranjang (Kotak Ikon 1:1 Presisi) */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={disabled || isAdding}
                        className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isAdded
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : 'bg-accent-50/80 border-accent-300 text-primary-900 hover:bg-accent-100/90 hover:border-accent-400'
                        }`}
                        title={isAdded ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                        aria-label={isAdded ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                    >
                        {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary-900" />
                        ) : isAdded ? (
                            <Check className="w-4 h-4 text-white stroke-[2.5]" />
                        ) : (
                            <ShoppingCart className="w-4 h-4 stroke-2" />
                        )}
                    </button>

                    {/* TOMBOL 2: Beli Langsung (Proporsional & Presisi Sejajar) */}
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={disabled}
                        className="flex-1 h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
                        style={{
                            backgroundColor: 'var(--color-card-product-btn, var(--card-product-btn, var(--color-primary, #6E4F78)))',
                            color: 'var(--card-product-btn-text, #ffffff)',
                        }}
                        title="Beli Sekarang"
                        aria-label="Beli Sekarang"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Beli Sekarang</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
