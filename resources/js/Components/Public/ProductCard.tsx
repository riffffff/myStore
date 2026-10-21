import React, { useState, memo, useCallback } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Product, StockStatus } from '@/types/store';
import { ShoppingCart, Check, Banknote } from 'lucide-react';
import { formatRupiah, getPrimaryImageUrl } from '@/lib/utils';
import { PageProps } from '@/types';
import Button from '@/Components/Button';
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
            className="group relative rounded-xl sm:rounded-2xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border bg-white"
            style={{
                backgroundColor: 'var(--color-card-product-bg, #ffffff)',
                borderColor: 'var(--color-card-product-border, #e5e7eb)',
                color: 'var(--color-card-product-text, #1c1917)',
            }}
        >
            <Link href={route('products.show', productSlug)} className="flex flex-col cursor-pointer relative">
                {/* Ribbon HANYA muncul jika produk memiliki diskon */}
                <ProductCornerRibbon
                    discount={discountPercent ? `${discountPercent}% OFF` : null}
                    className="w-[78px] h-[78px] sm:w-[88px] sm:h-[88px]"
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
                    {/* TOMBOL 1: Masukkan Keranjang */}
                    <Button
                        type="button"
                        variant={isAdded ? 'success' : 'secondary'}
                        size="xs"
                        onClick={handleAddToCart}
                        disabled={disabled}
                        isLoading={isAdding}
                        className="flex-1 sm:h-9 text-[10px] sm:text-xs font-bold py-1 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl"
                        title="Masukkan ke Keranjang"
                        aria-label="Masukkan ke Keranjang"
                        leftIcon={
                            isAdded ? (
                                <Check className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                            )
                        }
                    >
                        <span className="truncate">
                            {isAdded ? 'Ditambah' : 'Keranjang'}
                        </span>
                    </Button>

                    {/* TOMBOL 2: Beli Langsung */}
                    <Button
                        type="button"
                        variant="primary"
                        size="xs"
                        onClick={handleBuyNow}
                        disabled={disabled}
                        className="flex-1 sm:h-9 text-[10px] sm:text-xs font-bold py-1 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl"
                        title="Beli Sekarang"
                        aria-label="Beli Sekarang"
                        leftIcon={<Banknote className="w-3.5 h-3.5 shrink-0" />}
                    >
                        <span className="truncate">Beli</span>
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
