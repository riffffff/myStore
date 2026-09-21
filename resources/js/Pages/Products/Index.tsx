import React from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ProductCard from '@/Components/Public/ProductCard';
import Pagination from '@/Components/Public/Pagination';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Product, ShopSetting } from '@/types/mebel';
import { RefreshCcw, Search, Sofa } from 'lucide-react';

interface ProductsIndexProps {
    products: {
        data: Product[];
        links: any[];
    };
    shopSettings: ShopSetting;
    filters: {
        stock_status?: string;
        sort?: string;
    };
}

export default function Index({ products, shopSettings, filters }: ProductsIndexProps) {
    const waNumber   = shopSettings?.whatsapp_number   || '6281234567890';
    const waTemplate = shopSettings?.whatsapp_template || '';

    const productsData    = Array.isArray(products?.data)  ? products.data  : [];
    const productsLinks   = Array.isArray(products?.links) ? products.links : [];
    const safeFilters     = filters && typeof filters === 'object' ? filters : {};
    const filterStockStatus = typeof safeFilters.stock_status === 'string' ? safeFilters.stock_status : '';
    const filterSort        = typeof safeFilters.sort === 'string' ? safeFilters.sort : '';
    const hasActiveFilters  = Boolean(filterStockStatus) || (Boolean(filterSort) && filterSort !== 'newest');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters: Record<string, string> = { ...safeFilters } as Record<string, string>;
        newFilters[key] = value;
        if (!value) delete newFilters[key];
        router.get(route('products.index'), newFilters, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout>
            <Head>
                <title>Katalog Gerobak dan Meubel | Agus Gerobak</title>
                <meta name="description" content="Jelajahi koleksi gerobak dan meubel berkualitas untuk usaha, rumah, toko, dan kebutuhan custom." />
            </Head>

            {/* Hero Banner */}
            <div className="bg-primary-800 py-16 sm:py-20 text-center text-white relative overflow-hidden">
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Katalog Produk</h1>
                    <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        Pilih berbagai layanan dan produk teknologi untuk mengembangkan bisnis Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar Filter */}
                    <ScrollReveal direction="left" className="w-full md:w-80 shrink-0">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 sticky top-24">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                <Search className="h-5 w-5 text-primary-600" />
                                <h3 className="font-bold text-primary-900 text-base">FILTER & URUTKAN</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-primary-700 block mb-2">STATUS STOK</label>
                                    <select
                                        value={filterStockStatus}
                                        onChange={(e) => handleFilterChange('stock_status', e.target.value)}
                                        className="w-full rounded-lg border-2 border-gray-300 text-primary-900 bg-white focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 text-sm py-2.5 px-3 transition outline-none"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="available">Ready Stock</option>
                                        <option value="preorder">Pre Order</option>
                                        <option value="out_of_stock">Kosong</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-primary-700 block mb-2">URUTKAN</label>
                                    <select
                                        value={filterSort || 'newest'}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="w-full rounded-lg border-2 border-gray-300 text-primary-900 bg-white focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 text-sm py-2.5 px-3 transition outline-none"
                                    >
                                        <option value="newest">Terbaru</option>
                                        <option value="price_low">Harga Terendah</option>
                                        <option value="price_high">Harga Tertinggi</option>
                                    </select>
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={() => router.get(route('products.index'))}
                                    className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-primary-900 hover:bg-gray-200 text-sm font-semibold transition flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Bersihkan Filter
                                </button>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Grid Produk */}
                    <div className="grow w-full">
                        {productsData.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {productsData.map((product, index) => (
                                        product ? (
                                            <ScrollReveal key={product.id ?? index} delay={(index % 3) * 150} direction="up">
                                                <ProductCard
                                                    product={product}
                                                    whatsappNumber={waNumber}
                                                    whatsappTemplate={waTemplate}
                                                />
                                            </ScrollReveal>
                                        ) : null
                                    ))}
                                </div>
                                <Pagination links={productsLinks} />
                            </>
                        ) : (
                            <ScrollReveal direction="none">
                                <div className="bg-white p-16 text-center rounded-2xl border border-mahogany-100 shadow-sm max-w-md mx-auto space-y-4">
                                    <Sofa className="mx-auto h-12 w-12 text-mahogany-700" />
                                    <h3 className="text-lg font-bold text-stone-900">Produk Tidak Ditemukan</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">
                                        Maaf, tidak ada produk yang sesuai dengan filter Anda. Coba ubah atau bersihkan filter.
                                    </p>
                                    <button
                                        onClick={() => router.get(route('products.index'))}
                                        className="px-5 py-2.5 bg-mahogany-800 hover:bg-mahogany-700 text-white font-bold rounded-xl shadow-sm transition text-xs"
                                    >
                                        Lihat Semua Produk
                                    </button>
                                </div>
                            </ScrollReveal>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
