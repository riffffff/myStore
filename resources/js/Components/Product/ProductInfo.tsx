import React, { memo } from 'react';

interface ProductInfoProps {
    productName: string;
    formattedPrice: string;
}

const ProductInfo = memo(function ProductInfo({ productName, formattedPrice }: ProductInfoProps) {
    return (
        <>
            <div className="space-y-1.5">
                <span className="font-extrabold uppercase tracking-wider text-xs block text-accent-600">
                    Detail Produk
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
                    {productName}
                </h1>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl space-y-1 border bg-accent-50/60 border-accent-200/80">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">Harga Produk</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{formattedPrice}</div>
            </div>
        </>
    );
});

export default ProductInfo;
