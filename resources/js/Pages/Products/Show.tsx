import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/Contexts/ToastContext';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Product, ShopSetting } from '@/types/store';
import { PageProps } from '@/types';
import { formatRupiah, getImageUrl, getPrimaryImageUrl, buildWhatsAppProductUrl, getSafeShopSettings } from '@/lib/utils';
import { isFirstPageLoad } from '@/lib/navigation';
import AuthModal from '@/Components/Public/AuthModal';
import Button from '@/Components/Button';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import ProductCornerRibbon from '@/Components/Public/ProductCornerRibbon';
import {
    ShoppingCart,
    ShoppingBag,
    MessageCircle,
    Minus,
    Plus,
    Check
} from 'lucide-react';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800';

interface ProductShowProps {
    product: Product;
    shopSettings?: ShopSetting;
}

export default function Show({ product, shopSettings }: ProductShowProps) {
    const safeSettings = getSafeShopSettings(shopSettings);
    const { auth, cart } = usePage<PageProps>().props as any;
    const user = auth?.user;
    const isLoggedIn = !!user;
    const cartCount = Number(cart?.total_quantity ?? 0);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
    const isFirstLoad = isFirstPageLoad();
    const [isMounted, setIsMounted] = useState<boolean>(!isFirstLoad);
    const [qty, setQty] = useState<number>(1);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isFirstLoad) {
            const t = setTimeout(() => setIsMounted(true), 30);
            return () => clearTimeout(t);
        }
    }, [isFirstLoad]);

    const openAuthModal = useCallback((mode: 'login' | 'register') => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    }, []);

    const productData = useMemo(
        () => ({
            name: product?.name ?? 'Produk',
            shortDesc: product?.short_description ?? '',
            description: product?.description ?? '',
            price: product?.price ?? 0,
            originalPrice: product?.original_price ? Number(product.original_price) : 0,
            stockStatus: product?.stock_status ?? 'preorder',
            images: Array.isArray(product?.images) ? product.images : [],
            id: product?.id,
            slug: product?.slug ?? '',
        }),
        [product]
    );

    const isOutOfStock = productData.stockStatus === 'out_of_stock';
    const hasDiscount = productData.originalPrice > Number(productData.price);
    const discountPercent = hasDiscount
        ? Math.round(((productData.originalPrice - Number(productData.price)) / productData.originalPrice) * 100)
        : null;
    const inCartQty = (cart?.items && productData.id) ? Number(cart.items[productData.id] ?? 0) : 0;
    const formattedPrice = useMemo(() => formatRupiah(productData.price), [productData.price]);
    const formattedOriginalPrice = useMemo(
        () => (hasDiscount ? formatRupiah(productData.originalPrice) : ''),
        [hasDiscount, productData.originalPrice]
    );
    const defaultImgUrl = useMemo(
        () => getPrimaryImageUrl(productData.images, DEFAULT_PRODUCT_IMG),
        [productData.images]
    );

    // Active Gallery Image
    const [activeImage, setActiveImage] = useState<string>(defaultImgUrl);
    useEffect(() => {
        setActiveImage(defaultImgUrl);
    }, [defaultImgUrl]);

    const activeImageIndex = useMemo(() => {
        const idx = productData.images.findIndex((img) => getImageUrl(img?.url, DEFAULT_PRODUCT_IMG) === activeImage);
        return idx >= 0 ? idx + 1 : 1;
    }, [productData.images, activeImage]);

    const whatsappUrl = useMemo(() => {
        const waNumber = safeSettings.whatsapp_number;
        const waTemplate = safeSettings.whatsapp_template;

        return buildWhatsAppProductUrl({
            phoneNumber: waNumber,
            template: waTemplate,
            productName: productData.name,
            productPrice: formattedPrice,
        });
    }, [safeSettings, productData.name, formattedPrice]);

    const productJsonLd = useMemo(() => {
        const canonicalUrl = route('products.show', productData.slug);
        return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productData.name,
            description: productData.shortDesc || productData.description,
            image: productData.images.map((image) => getImageUrl(image?.url, DEFAULT_PRODUCT_IMG)).filter(Boolean),
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
    const shopName = safeSettings.shop_name;
    const pageTitle = shopName ? `${productData.name} - ${shopName}` : productData.name;
    const metaDescription =
        productData.shortDesc || 'Detail spesifikasi dan pemesanan produk berkualitas di toko kami.';
    const displayDesc = productData.description || productData.shortDesc || '';

    // Handle Quantity Stepper
    const incrementQty = () => setQty((prev) => Math.min(99, prev + 1));
    const decrementQty = () => setQty((prev) => Math.max(1, prev - 1));

    // Add To Cart Handler
    const handleAddToCart = (e?: React.MouseEvent) => {
        if (!isLoggedIn) {
            openAuthModal('login');
            return;
        }
        if (isOutOfStock) return;

        setIsAddingToCart(true);
        router.post(
            route('cart.store'),
            {
                product_id: productData.id,
                quantity: qty,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddedSuccess(true);
                    setTimeout(() => setIsAddedSuccess(false), 2500);
                },
                onError: () => {
                    toast('Gagal menambahkan ke keranjang. Coba lagi.', 'error');
                },
                onFinish: () => setIsAddingToCart(false),
            }
        );
    };

    // Buy Now Handler (Direct Checkout)
    const handleBuyNow = () => {
        if (!isLoggedIn) {
            openAuthModal('login');
            return;
        }
        if (isOutOfStock) return;

        router.visit(route('orders.create', {
            product_id: productData.id,
            quantity: qty,
        }));
    };

    return (
        <PublicLayout hideBottomNav={true}>
            <Head title={pageTitle}>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="product" />
                <meta property="og:image" content={defaultImgUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd }} />
            </Head>

            {/* ══════════ MAIN CONTENT ══════════ */}
            <div className="min-h-screen pb-24 md:pb-12 pt-2 sm:pt-4">
                <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

                    {/* Breadcrumbs (Mobile & Desktop) */}
                    <nav className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 flex items-center gap-2" aria-label="Breadcrumb">
                        <Link href={route('home')} className="hover:text-gray-900 transition">
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link href={route('products.index')} className="hover:text-gray-900 transition">
                            Katalog
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-bold truncate max-w-50 sm:max-w-none">{productData.name}</span>
                    </nav>


                    <div
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-6 lg:gap-8 ${
                            isFirstLoad ? `transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}` : 'opacity-100'
                        }`}
                    >
                        {/* ─── KOLOM KIRI: Galeri Gambar (Tokopedia 1:1) ─── */}
                        <div
                            className="lg:col-span-7 space-y-3 sm:rounded-2xl sm:p-5 sm:border sm:shadow-xs"
                            style={{
                                backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                borderColor: 'var(--color-card-product-border, #EBD9AC)',
                            }}
                        >
                            {/* Gambar Utama 1:1 */}
                            <div className="relative aspect-square w-full">
                                {/* Ribbon HANYA tampil jika produk memiliki diskon */}
                                <ProductCornerRibbon
                                    discount={discountPercent ? `${discountPercent}% OFF` : null}
                                    className="w-24 h-24 sm:w-27.5 sm:h-27.5 z-20"
                                />

                                <div className="w-full h-full bg-gray-50 overflow-hidden sm:rounded-xl">
                                    <img
                                        src={activeImage}
                                        alt={productData.name}
                                        className="w-full h-full object-cover object-center transition-all duration-300"
                                    />

                                    {/* Counter Foto (Pojok Kanan Bawah ala Tokopedia) */}
                                    {productData.images.length > 0 && (
                                        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium shadow-md">
                                            {activeImageIndex} / {productData.images.length}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail List */}
                            {productData.images.length > 1 && (
                                <div className="flex gap-2.5 overflow-x-auto p-2 scrollbar-none">
                                    {productData.images.map((img, idx) => {
                                        const url = getImageUrl(img?.url, DEFAULT_PRODUCT_IMG);
                                        const isSelected = activeImage === url;
                                        return (
                                            <button
                                                key={img.id ?? idx}
                                                type="button"
                                                onClick={() => setActiveImage(url)}
                                                className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                                    isSelected
                                                        ? 'border-accent-500 ring-2 ring-accent-500/30'
                                                        : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ─── KOLOM KANAN: Detail & Transaksi Tokopedia ─── */}
                        <div className="lg:col-span-5 space-y-3">
                            
                            {/* Card 1: Harga, Judul, & Rating (Tokopedia Style) */}
                            <div
                                className="p-4 sm:p-6 sm:rounded-2xl border-b sm:border sm:shadow-xs space-y-3"
                                style={{
                                    backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                }}
                            >
                                {/* Harga Besar */}
                                <div className="space-y-1">
                                    {hasDiscount && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm sm:text-base text-gray-400 line-through">
                                                {formattedOriginalPrice}
                                            </span>
                                            <span
                                                className="px-2 py-0.5 rounded text-[11px] font-black border"
                                                style={{
                                                    color: 'var(--price-color, #E63854)',
                                                    backgroundColor: 'color-mix(in srgb, var(--price-color, #E63854) 8%, white)',
                                                    borderColor: 'color-mix(in srgb, var(--price-color, #E63854) 20%, transparent)',
                                                }}
                                            >
                                                Hemat {discountPercent}%
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                                        style={{ color: 'var(--price-color, #E63854)' }}
                                    >
                                        {formattedPrice}
                                    </div>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-50 text-accent-700 text-[11px] font-bold">
                                        Harga Terbaik Toko
                                    </div>
                                </div>

                                {/* Judul Produk */}
                                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                                    {productData.name}
                                </h1>
                            </div>

                            {/* Card 2: Atur Jumlah & Subtotal (Desktop & Mobile) */}
                            <div
                                className="p-4 sm:p-5 sm:rounded-2xl border-b sm:border sm:shadow-xs space-y-3"
                                style={{
                                    backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                }}
                            >
                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                    Atur Jumlah
                                </span>

                                <div className="flex items-center justify-between gap-4">
                                    {/* Stepper Jumlah */}
                                    <div
                                        className="inline-flex items-center border rounded-xl overflow-hidden shadow-2xs h-10"
                                        style={{
                                            backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                            borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={decrementQty}
                                            disabled={qty <= 1 || isOutOfStock}
                                            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition disabled:opacity-30 shrink-0"
                                            aria-label="Kurangi"
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-12 text-center font-bold text-gray-900 text-sm">
                                            {qty}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={incrementQty}
                                            disabled={qty >= 99 || isOutOfStock}
                                            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition disabled:opacity-30 shrink-0"
                                            aria-label="Tambah"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* Subtotal Dinamis */}
                                    <div className="text-right">
                                        <span className="text-[11px] text-gray-500 block">Subtotal</span>
                                        <span className="text-lg font-black text-gray-900">
                                            {formatRupiah(productData.price * qty)}
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop Action Buttons (Pada mobile pindah ke fixed navbar) */}
                                <div className="hidden md:grid grid-cols-2 gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant={isAddedSuccess ? 'primary' : 'secondary'}
                                        size="md"
                                        onClick={(e) => handleAddToCart(e)}
                                        disabled={isOutOfStock}
                                        isLoading={isAddingToCart}
                                        loadingText="Menambahkan..."
                                        className={isAddedSuccess ? 'bg-emerald-600! text-white! border-emerald-600! shadow-md transition-all duration-300' : ''}
                                        leftIcon={isAddedSuccess ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                    >
                                        {isAddedSuccess ? 'Masuk Keranjang!' : inCartQty > 0 ? `+ Keranjang (${inCartQty})` : '+ Keranjang'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="md"
                                        onClick={handleBuyNow}
                                        disabled={isOutOfStock}
                                    >
                                        Beli Langsung
                                    </Button>
                                </div>
                            </div>

                            {/* Card 6: Deskripsi Produk */}
                            <div
                                className="p-4 sm:p-5 sm:rounded-2xl border-b sm:border sm:shadow-xs space-y-3"
                                style={{
                                    backgroundColor: 'var(--color-card-product-bg, #FFFDF7)',
                                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                                }}
                            >
                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                    Deskripsi Produk
                                </span>
                                {displayDesc ? (
                                    displayDesc.includes('<') ? (
                                        <div
                                            className="prose prose-stone max-w-none text-gray-700 text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: displayDesc }}
                                        />
                                    ) : (
                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                            {displayDesc}
                                        </p>
                                    )
                                ) : (
                                    <p className="text-gray-400 text-sm italic">
                                        Tidak ada deskripsi detail untuk produk ini.
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════ TOKOPEDIA MOBILE STICKY BOTTOM ACTION NAVBAR ══════════ */}
            <div
                className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t shadow-[0_-4px_24px_rgba(0,0,0,0.09)] px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0))] flex items-center gap-2 backdrop-blur-md"
                style={{
                    bottom: '-1px',
                    backgroundColor: 'color-mix(in srgb, var(--color-bg, var(--page-bg, #FCF6E5)) 94%, transparent)',
                    borderColor: 'var(--color-card-product-border, #EBD9AC)',
                }}
            >
                {/* 1. Tombol Chat WhatsApp */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center w-12 h-11 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-gray-50 active:bg-gray-100 transition shrink-0"
                    aria-label="Chat Penjual"
                >
                    <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                    <span className="text-[10px] font-semibold tracking-tight mt-0.5">Chat</span>
                </a>

                {/* 2. Tombol "+ Keranjang" dengan Ikon */}
                <Button
                    type="button"
                    variant={isAddedSuccess ? 'primary' : 'secondary'}
                    size="md"
                    onClick={(e) => handleAddToCart(e)}
                    disabled={isOutOfStock}
                    isLoading={isAddingToCart}
                    loadingText="Menambahkan..."
                    className={`flex-1 h-11 text-xs sm:text-sm transition-all duration-300 font-bold ${isAddedSuccess ? 'bg-emerald-600! text-white! border-emerald-600! shadow-sm' : ''}`}
                    leftIcon={isAddedSuccess ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                >
                    {isOutOfStock ? 'Habis' : isAddedSuccess ? 'Masuk!' : inCartQty > 0 ? `+ Keranjang (${inCartQty})` : '+ Keranjang'}
                </Button>

                {/* 3. Tombol "Beli Langsung" dengan Ikon */}
                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-11 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200"
                    leftIcon={<ShoppingBag className="h-4 w-4" />}
                >
                    {isOutOfStock ? 'Stok Habis' : 'Beli Langsung'}
                </Button>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authModalMode}
            />
        </PublicLayout>
    );
}
