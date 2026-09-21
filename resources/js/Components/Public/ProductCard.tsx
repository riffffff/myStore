import React, { useState, memo, useCallback } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Product, StockStatus } from '@/types/mebel';
import { ShoppingCart, Check } from 'lucide-react';
import { formatRupiah, getPrimaryImageUrl, buildWhatsAppProductUrl } from '@/lib/utils';
import { PageProps } from '@/types';
import WhatsAppButton from '@/Components/Public/WhatsAppButton';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800';

interface ProductCardProps {
    product: Product;
    whatsappNumber: string;
    whatsappTemplate: string;
}

/**
 * Product card component - memoized to prevent unnecessary re-renders in product grids
 */
const ProductCard = memo(function ProductCard({ product, whatsappNumber, whatsappTemplate }: ProductCardProps) {
    const { auth } = usePage<PageProps>().props as any;
    const user = auth?.user;

    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const productName        = product?.name ?? 'Produk';
    const productSlug        = product?.slug ?? '';
    const productShortDesc   = product?.short_description ?? '';
    const productPrice       = product?.price ?? 0;
    const productStockStatus = product?.stock_status ?? 'preorder';
    const productImages      = Array.isArray(product?.images) ? product.images : [];

    const imageUrl = getPrimaryImageUrl(productImages, DEFAULT_PRODUCT_IMG);
    const formattedPrice = formatRupiah(productPrice);

    const whatsappUrl = buildWhatsAppProductUrl({
        phoneNumber: whatsappNumber,
        template: whatsappTemplate,
        productName,
        productPrice: formattedPrice,
    });

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
            { product_id: product.id, quantity: 1 },
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
    }, [user, productSlug, product.id]);

    const status = productStockStatus as StockStatus;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-mahogany-100/60 shadow-xs hover:shadow-xl hover:border-mahogany-300/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Area yang bisa diklik menuju detail produk */}
            <Link href={route('products.show', productSlug)} className="flex flex-col cursor-pointer">

                {/* Gambar */}
                <div className="relative aspect-square overflow-hidden bg-mahogany-50">
                    <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Vignette hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-mahogany-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge status */}
                    <div className="absolute top-3 left-3">
                        {status === 'available' ? (
                            <span className="bg-emerald-800 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                                Ready Stock
                            </span>
                        ) : status === 'out_of_stock' ? (
                            <span className="bg-rose-800 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                                Stok Habis
                            </span>
                        ) : (
                            <span className="bg-mahogany-700 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                                Pre Order
                            </span>
                        )}
                    </div>
                </div>

                {/* Info produk (tanpa tombol aksi) */}
                <div className="p-4 sm:p-5 flex flex-col">
                    <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-mahogany-800 transition-colors duration-200">
                        {productName}
                    </h3>

                    <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {productShortDesc || 'Produk gerobak dan meubel pilihan untuk kebutuhan usaha dan rumah.'}
                    </p>

                    <div className="mt-4 pt-3.5 border-t border-mahogany-50">
                        <span className="text-[10px] text-mahogany-400 block uppercase tracking-wider font-semibold">Harga</span>
                        <span className="text-base font-extrabold text-mahogany-900 block">
                            {formattedPrice}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Tombol aksi DI LUAR <Link> agar tidak nested anchor */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 mt-auto">
                <div className="flex items-center gap-1.5">
                    {/* Tombol keranjang */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding || status === 'out_of_stock'}
                        className={`inline-flex items-center justify-center flex-1 p-2.5 rounded-xl font-bold shadow-xs transition ${
                            isAdded
                                ? 'bg-emerald-700 text-white'
                                : isAdding
                                ? 'bg-mahogany-100 text-mahogany-700 opacity-70 cursor-wait'
                                : status === 'out_of_stock'
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                : 'bg-mahogany-800 text-white hover:bg-mahogany-700 active:scale-95'
                        }`}
                        title="Tambah ke Keranjang"
                        aria-label="Tambah ke Keranjang"
                    >
                        {isAdded ? (
                            <span className="inline-flex items-center gap-2 text-xs">
                                <Check className="w-4 h-4" /> Ditambahkan
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-xs">
                                <ShoppingCart className="w-4 h-4" /> Keranjang
                            </span>
                        )}
                    </button>

                    {/* Tombol WhatsApp */}
                    <WhatsAppButton
                        href={whatsappUrl}
                        size="sm"
                        className="flex-1"
                    >
                        Pesan WA
                    </WhatsAppButton>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
