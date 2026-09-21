import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Product, ShopSetting } from '@/types/mebel';
import { formatRupiah, getPrimaryImageUrl, buildWhatsAppProductUrl } from '@/lib/utils';
import AuthModal from '@/Components/Public/AuthModal';
import ProductImageGallery from '@/Components/Product/ProductImageGallery';
import ProductInfo from '@/Components/Product/ProductInfo';
import AddToCartForm from '@/Components/Product/AddToCartForm';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800';

interface ProductShowProps {
    product: Product;
    shopSettings: ShopSetting;
}

export default function Show({ product, shopSettings }: ProductShowProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isLoggedIn = !!user;
    
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        const t = setTimeout(() => setIsMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    const openAuthModal = useCallback((mode: 'login' | 'register') => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    }, []);

    // Memoize product data to avoid recalculations
    const productData = useMemo(() => ({
        name: product?.name ?? 'Produk',
        shortDesc: product?.short_description ?? '',
        description: product?.description ?? '',
        price: product?.price ?? 0,
        stockStatus: product?.stock_status ?? 'preorder',
        images: Array.isArray(product?.images) ? product.images : [],
        id: product?.id,
        slug: product?.slug ?? '',
    }), [product]);

    const isOutOfStock = productData.stockStatus === 'out_of_stock';
    const formattedPrice = useMemo(() => formatRupiah(productData.price), [productData.price]);
    const defaultImgUrl = useMemo(
        () => getPrimaryImageUrl(productData.images, DEFAULT_PRODUCT_IMG),
        [productData.images]
    );

    // Memoize WhatsApp URL
    const whatsappUrl = useMemo(() => {
        const waNumber = shopSettings?.whatsapp_number || '6281234567890';
        const waTemplate = shopSettings?.whatsapp_template || '';
        
        return buildWhatsAppProductUrl({
            phoneNumber: waNumber,
            template: waTemplate,
            productName: productData.name,
            productPrice: formattedPrice,
        });
    }, [shopSettings, productData.name, formattedPrice]);

    // Memoize JSON-LD schema
    const productJsonLd = useMemo(() => {
        const canonicalUrl = route('products.show', productData.slug);
        return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productData.name,
            description: productData.shortDesc || productData.description,
            image: productData.images.map((image) => image?.url).filter(Boolean),
            sku: productData.id ? String(productData.id) : undefined,
            offers: {
                '@type': 'Offer',
                url: canonicalUrl,
                priceCurrency: 'IDR',
                price: productData.price,
                availability:
                    productData.stockStatus === 'available'
                        ? 'https://schema.org/InStock'
                        : productData.stockStatus === 'out_of_stock'
                        ? 'https://schema.org/OutOfStock'
                        : 'https://schema.org/PreOrder',
            },
        }).replace(/</g, '\\u003c');
    }, [productData]);

    const canonicalUrl = route('products.show', productData.slug);
    const shopName = shopSettings?.shop_name || 'Agus Gerobak';

    return (
        <PublicLayout>
            <Head>
                <title>{`${productData.name} | ${shopName}`}</title>
                <meta
                    name="description"
                    content={
                        productData.shortDesc ||
                        'Gerobak dan meubel berkualitas untuk usaha, rumah, dan pesanan custom.'
                    }
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={`${productData.name} | ${shopName}`} />
                <meta
                    property="og:description"
                    content={
                        productData.shortDesc ||
                        'Gerobak dan meubel berkualitas untuk usaha, rumah, dan pesanan custom.'
                    }
                />
                <meta property="og:type" content="product" />
                <meta property="og:image" content={defaultImgUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd }} />
            </Head>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumb */}
                <nav
                    className="text-xs sm:text-sm text-stone-400 mb-6 flex items-center gap-2"
                    aria-label="Breadcrumb"
                >
                    <Link href={route('home')} className="hover:text-mahogany-700 transition">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('products.index')} className="hover:text-mahogany-700 transition">
                        Katalog
                    </Link>
                    <span>/</span>
                    <span className="text-stone-900 font-bold truncate">{productData.name}</span>
                </nav>

                <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-10 transition-opacity duration-400 ease-out ${
                        isMounted ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* Image Gallery */}
                    <ProductImageGallery
                        images={productData.images}
                        productName={productData.name}
                        stockStatus={productData.stockStatus}
                        defaultImage={defaultImgUrl}
                    />

                    {/* Product Info & Purchase Panel */}
                    <div className="lg:col-span-5 space-y-6">
                        <ProductInfo
                            productName={productData.name}
                            formattedPrice={formattedPrice}
                            shortDescription={productData.shortDesc}
                        />

                        <AddToCartForm
                            productId={productData.id || 0}
                            productPrice={productData.price}
                            isLoggedIn={isLoggedIn}
                            isOutOfStock={isOutOfStock}
                            whatsappUrl={whatsappUrl}
                            onAuthModalOpen={openAuthModal}
                        />
                    </div>
                </div>

                {/* Full Description */}
                {productData.description && (
                    <div className="mt-14 pt-10 border-t border-mahogany-100">
                        <h2 className="text-lg font-extrabold text-stone-900 mb-4 border-l-4 border-mahogany-700 pl-3">
                            Deskripsi Produk
                        </h2>
                        <div
                            className="prose prose-stone max-w-none text-stone-600 leading-relaxed text-sm space-y-3"
                            dangerouslySetInnerHTML={{ __html: productData.description }}
                        />
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authModalMode}
            />
        </PublicLayout>
    );
}
