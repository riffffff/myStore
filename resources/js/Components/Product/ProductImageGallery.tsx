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
                <span className="bg-accent-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                    Tersedia
                </span>
            );
        }
        if (stockStatus === 'out_of_stock') {
            return (
                <span className="bg-rose-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                    Habis
                </span>
            );
        }
        return (
            <span className="bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                Pre-Order
            </span>
        );
    };

    return (
        <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
                <img src={activeImageUrl} alt={productName} className="w-full h-full object-cover object-center" />
                <div className="absolute top-4 left-4">{getStockBadge()}</div>
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {images.map((img, index) => {
                        if (!img?.url) return null;
                        const imgUrl = getImageUrl(img.url, defaultImage);
                        const isActive = activeImageUrl === imgUrl;
                        return (
                            <button
                                key={img.id ?? `thumb-${index}`}
                                onClick={() => handleThumbnailClick(imgUrl)}
                                className={`aspect-square rounded-xl overflow-hidden border bg-gray-50 transition-all duration-200 ${
                                    isActive ? 'ring-2 scale-[0.98]' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                style={
                                    isActive
                                        ? {
                                              borderColor: 'var(--color-primary-btn, #0D9488)',
                                              '--tw-ring-color': 'color-mix(in srgb, var(--color-primary-btn, #0D9488) 25%, transparent)',
                                          } as React.CSSProperties
                                        : undefined
                                }
                                type="button"
                            >
                                <img
                                    src={imgUrl}
                                    alt={`${productName} ${index + 1}`}
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
