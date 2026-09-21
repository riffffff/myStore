import React, { useState, useCallback, memo } from 'react';
import { getImageUrl } from '@/lib/utils';

interface ProductImage {
    id?: number;
    url?: string;
    is_primary?: boolean;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName: string;
    stockStatus: string;
    defaultImage: string;
}

/**
 * Product image gallery with main image and thumbnails
 * Memoized to prevent unnecessary re-renders
 */
const ProductImageGallery = memo(function ProductImageGallery({
    images,
    productName,
    stockStatus,
    defaultImage,
}: ProductImageGalleryProps) {
    const [activeImageUrl, setActiveImageUrl] = useState<string>(defaultImage);

    const handleThumbnailClick = useCallback((url: string) => {
        setActiveImageUrl(url);
    }, []);

    const getStockBadge = () => {
        if (stockStatus === 'available') {
            return (
                <span className="bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                    Ready Stock
                </span>
            );
        }
        if (stockStatus === 'out_of_stock') {
            return (
                <span className="bg-rose-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                    Stok Habis
                </span>
            );
        }
        return (
            <span className="bg-mahogany-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                Pre Order
            </span>
        );
    };

    return (
        <div className="lg:col-span-7 space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-mahogany-50 rounded-2xl overflow-hidden border border-mahogany-100 shadow-sm relative">
                <img
                    src={activeImageUrl}
                    alt={productName}
                    className="w-full h-full object-cover object-center"
                />

                {/* Stock Badge */}
                <div className="absolute top-4 left-4">{getStockBadge()}</div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {images.map((img) => {
                        if (!img?.url) return null;
                        const imgUrl = getImageUrl(img.url, defaultImage);
                        const isActive = activeImageUrl === imgUrl;
                        return (
                            <button
                                key={img.id ?? Math.random()}
                                onClick={() => handleThumbnailClick(imgUrl)}
                                className={`aspect-square rounded-xl overflow-hidden border bg-mahogany-50 transition-all duration-200 ${
                                    isActive
                                        ? 'border-mahogany-700 ring-2 ring-mahogany-700/20 scale-[0.98]'
                                        : 'border-mahogany-100 hover:border-mahogany-300'
                                }`}
                                type="button"
                            >
                                <img
                                    src={imgUrl}
                                    alt={`${productName} Gallery`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default ProductImageGallery;
