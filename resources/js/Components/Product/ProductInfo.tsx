import React, { memo } from 'react';

interface ProductInfoProps {
    productName: string;
    formattedPrice: string;
    shortDescription: string;
}

/**
 * Product information display (title, price, short description)
 * Memoized to prevent unnecessary re-renders
 */
const ProductInfo = memo(function ProductInfo({
    productName,
    formattedPrice,
    shortDescription,
}: ProductInfoProps) {
    return (
        <>
            {/* Title */}
            <div className="space-y-1.5">
                <span className="text-mahogany-600 font-extrabold uppercase tracking-wider text-xs block">
                    Mebel Jati Premium
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-tight">
                    {productName}
                </h1>
            </div>

            {/* Price */}
            <div className="p-4 sm:p-5 bg-mahogany-50 border border-mahogany-200/60 rounded-2xl space-y-1">
                <span className="text-xs text-mahogany-500 uppercase tracking-wider font-semibold">
                    Harga Produk
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-mahogany-900">
                    {formattedPrice}
                </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
                <h3 className="font-bold text-stone-800 text-xs uppercase tracking-wider border-b border-mahogany-100 pb-2">
                    Keterangan Singkat
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                    {shortDescription || 'Produk gerobak dan meubel berkualitas untuk kebutuhan usaha dan rumah.'}
                </p>
            </div>
        </>
    );
});

export default ProductInfo;
