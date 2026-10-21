import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ProductCard from '@/Components/Public/ProductCard';
import ScrollReveal from '@/Components/Public/ScrollReveal';
import { Product, ShopSetting } from '@/types/store';
import {
    RefreshCcw,
    Search,
    Package,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
    SlidersHorizontal,
    X,
    Banknote,
    ArrowDown,
    ArrowUp,
    LayoutGrid,
} from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { getSafeShopSettings } from '@/lib/utils';
import Button from '@/Components/Button';

interface CategoryItem {
    category: string;
    count: number;
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        current_page?: number;
        last_page?: number;
        from?: number | null;
        to?: number | null;
        total?: number;
        per_page?: number;
        prev_page_url?: string | null;
        next_page_url?: string | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
            page: number | null;
        }>;
    };
    shopSettings?: ShopSetting;
    filters: {
        stock_status?: string;
        category?: string;
        sort?: string;
        search?: string;
        min_price?: string | number;
        max_price?: string | number;
        per_page?: number | string;
    };
    categories?: CategoryItem[];
}

const stockOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'available', label: 'Tersedia' },
    { value: 'preorder', label: 'Pre-Order' },
    { value: 'out_of_stock', label: 'Stok Habis' },
];

const perPageOptions = [
    { value: 3, label: '3 produk' },
    { value: 6, label: '6 produk' },
    { value: 12, label: '12 produk' },
    { value: 24, label: '24 produk' },
];

const sortOptions = [
    { value: 'popular', label: 'Populer' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'top_sales', label: 'Terlaris' },
    { value: 'price_low', label: 'Harga Terendah', icon: 'down' as const },
    { value: 'price_high', label: 'Harga Tertinggi', icon: 'up' as const },
];

const primaryBtnStyle = { backgroundColor: 'var(--color-primary-btn, #0D9488)' };
const primaryTextStyle = { color: 'var(--color-primary-btn, #0D9488)' };

export default function Index({ products, shopSettings, filters }: ProductsIndexProps) {
    const safeSettings = getSafeShopSettings(shopSettings);
    const waNumber = safeSettings.whatsapp_number;
    const waTemplate = safeSettings.whatsapp_template;
    const shopName = safeSettings.shop_name ?? '';

    const productsData = Array.isArray(products?.data) ? products.data : [];
    const productsLinks = Array.isArray(products?.links) ? products.links : [];
    const lastPage = products?.last_page ?? 1;
    const totalProducts = products?.total ?? productsData.length;

    const safeFilters = filters && typeof filters === 'object' ? filters : {};
    const filterStockStatus = typeof safeFilters.stock_status === 'string' ? safeFilters.stock_status : '';
    const filterSearch = typeof safeFilters.search === 'string' ? safeFilters.search : '';

    // Inisialisasi sinkron untuk menghindari kedip (flicker) dari default ke pilihan terakhir
    const getInitialSort = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const urlSort = urlParams.get('sort');
            if (urlSort) return urlSort;
            if (urlParams.has('page') && !urlParams.has('sort')) {
                return 'popular';
            }
            try {
                const saved = sessionStorage.getItem('store_catalog_filters');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (typeof parsed?.sort === 'string' && parsed.sort) return parsed.sort;
                }
            } catch {}
        }
        return typeof safeFilters.sort === 'string' && safeFilters.sort ? safeFilters.sort : 'popular';
    };

    const [currentSort, setCurrentSort] = useState<string>(getInitialSort);

    // Sinkronkan state saat props dari server berubah
    useEffect(() => {
        if (typeof safeFilters.sort === 'string' && safeFilters.sort) {
            setCurrentSort(safeFilters.sort);
        } else {
            setCurrentSort('popular');
        }
    }, [safeFilters.sort]);

    const filterSort = currentSort;

    const currentPerPage = Number(safeFilters.per_page) || products?.per_page || 6;

    const [minPriceInput, setMinPriceInput] = useState<string>(
        safeFilters.min_price !== undefined ? String(safeFilters.min_price) : ''
    );
    const [maxPriceInput, setMaxPriceInput] = useState<string>(
        safeFilters.max_price !== undefined ? String(safeFilters.max_price) : ''
    );
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
    const filterCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openMobileFilter = () => {
        setMobileFilterOpen(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setMobileFilterVisible(true));
        });
    };

    const closeMobileFilter = () => {
        setMobileFilterVisible(false);
        filterCloseTimer.current = setTimeout(() => setMobileFilterOpen(false), 320);
    };

    useEffect(() => () => {
        if (filterCloseTimer.current) clearTimeout(filterCloseTimer.current);
    }, []);

    // Lock body scroll when filter panel is open
    useEffect(() => {
        if (mobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileFilterOpen]);

    const hasActiveFilters =
        Boolean(filterStockStatus) ||
        Boolean(safeFilters.min_price) ||
        Boolean(safeFilters.max_price) ||
        Boolean(filterSearch) ||
        (filterSort !== 'popular' && Boolean(filterSort));

    const hasFilterBadges =
        Boolean(filterStockStatus) ||
        Boolean(safeFilters.min_price) ||
        Boolean(safeFilters.max_price) ||
        Boolean(filterSearch);

    const filterBadgeCount = [filterStockStatus, safeFilters.min_price || safeFilters.max_price, filterSearch].filter(
        Boolean
    ).length;

    const applyFilters = (updated: Record<string, any>) => {
        const query: Record<string, any> = {
            ...safeFilters,
            ...(currentSort && currentSort !== 'popular' ? { sort: currentSort } : {}),
            ...updated,
        };
        Object.keys(query).forEach((key) => {
            if (query[key] === '' || query[key] === null || query[key] === undefined) {
                delete query[key];
            }
        });

        try {
            sessionStorage.setItem('store_catalog_filters', JSON.stringify(query));
        } catch {}

        router.get(route('products.index'), query, { preserveState: true, preserveScroll: true });
    };

    // Pulihkan filter jika kembali ke katalog dari halaman lain tanpa query string
    useEffect(() => {
        const hasQuery = Boolean(window.location.search && window.location.search.length > 1);
        if (!hasQuery) {
            try {
                const saved = sessionStorage.getItem('store_catalog_filters');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                        router.get(route('products.index'), parsed, { preserveState: true, replace: true });
                    }
                }
            } catch {}
        }
    }, []);

    const handlePageChange = (targetPage: number) => {
        setCurrentSort('popular');

        const query: Record<string, any> = {
            ...safeFilters,
            page: targetPage,
        };
        // Reset sortir saat ganti halaman
        delete query.sort;

        Object.keys(query).forEach((key) => {
            if (query[key] === '' || query[key] === null || query[key] === undefined) {
                delete query[key];
            }
        });

        try {
            sessionStorage.setItem('store_catalog_filters', JSON.stringify(query));
        } catch {}

        router.get(route('products.index'), query, { preserveState: true, preserveScroll: true });
    };

    const handleSortChange = (newSort: string) => {
        setCurrentSort(newSort);
        applyFilters({ sort: newSort, page: 1 });
    };

    const handlePerPageChange = (val: number) => {
        applyFilters({ per_page: val, page: 1 });
    };

    const handleStockStatusChange = (statusValue: string) => {
        applyFilters({ stock_status: statusValue, page: 1 });
    };

    const handlePriceFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({
            min_price: minPriceInput ? minPriceInput.replace(/\D/g, '') : '',
            max_price: maxPriceInput ? maxPriceInput.replace(/\D/g, '') : '',
            page: 1,
        });
    };

    const handleResetFilters = () => {
        setCurrentSort('popular');
        setMinPriceInput('');
        setMaxPriceInput('');
        try {
            sessionStorage.removeItem('store_catalog_filters');
        } catch {}
        router.get(route('products.index'));
    };

    const clearPriceFilters = () => {
        applyFilters({ min_price: '', max_price: '', page: 1 });
        setMinPriceInput('');
        setMaxPriceInput('');
    };

    const chipClass = (active: boolean) =>
        `shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 h-8 rounded-full font-bold text-[11px] sm:text-xs transition ${
            active
                ? 'text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/80'
        }`;

    const renderFilterFields = (isMobile = false) => (
        <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Status Stok
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {stockOptions.map((opt) => {
                        const isActive = filterStockStatus === opt.value;
                        return (
                            <button
                                key={opt.value || 'all'}
                                type="button"
                                onClick={() => handleStockStatusChange(isActive ? '' : opt.value)}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-full font-semibold text-[11px] sm:text-xs transition-all ${
                                    isActive
                                        ? 'text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                                }`}
                                style={isActive ? primaryBtnStyle : undefined}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Rentang Harga
                </span>
                <form onSubmit={handlePriceFilterSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block pl-0.5">
                                Minimum
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-[10px] font-black text-gray-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minPriceInput}
                                    onChange={(e) => setMinPriceInput(e.target.value)}
                                    className="w-full text-xs pl-7 pr-2 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block pl-0.5">
                                Maksimum
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-[10px] font-black text-gray-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    placeholder="∞"
                                    value={maxPriceInput}
                                    onChange={(e) => setMaxPriceInput(e.target.value)}
                                    className="w-full text-xs pl-7 pr-2 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white transition"
                                />
                            </div>
                        </div>
                    </div>
                    {!isMobile && (
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            fullWidth
                        >
                            Terapkan Harga
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );

    const metaDescription = 'Temukan berbagai produk berkualitas terbaik dengan harga terjangkau di toko kami.';

    return (
        <PublicLayout>
            <Head title={`Katalog Produk - ${shopName}`}>
                <meta name="description" content={metaDescription} />
            </Head>

            <div
                className="hidden sm:block py-16 sm:py-20 text-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)' }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Katalog Produk</h1>
                    <p className="text-sm sm:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
                        Temukan berbagai produk berkualitas pilihan untuk memenuhi kebutuhan Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-6">
                            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                                    <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Filter</h2>
                                </div>
                                {(filterStockStatus || safeFilters.min_price || safeFilters.max_price) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMinPriceInput('');
                                            setMaxPriceInput('');
                                            applyFilters({ stock_status: '', min_price: '', max_price: '' });
                                        }}
                                        className="text-[11px] font-bold hover:opacity-80 transition shrink-0"
                                        style={primaryTextStyle}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            {renderFilterFields()}
                            {hasActiveFilters && (
                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                                    >
                                        <RefreshCcw className="w-3.5 h-3.5" />
                                        Hapus semua filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Mobile Filter Bottom Sheet — always rendered, animated with CSS transitions */}
                    {mobileFilterOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            {/* Overlay */}
                            <button
                                type="button"
                                className={`absolute inset-0 transition-all duration-300 ease-out ${
                                    mobileFilterVisible ? 'bg-black/50' : 'bg-black/0'
                                }`}
                                aria-label="Tutup filter"
                                onClick={closeMobileFilter}
                            />
                            {/* Panel */}
                            <div
                                className={`absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
                                    mobileFilterVisible ? 'translate-y-0' : 'translate-y-full'
                                }`}
                            >
                                {/* Handle bar */}
                                <div className="flex justify-center pt-3 pb-1 shrink-0">
                                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                                        <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                                            Filter
                                        </h2>
                                        {hasFilterBadges && (
                                            <span
                                                className="w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                                                style={primaryBtnStyle}
                                            >
                                                {filterBadgeCount}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeMobileFilter}
                                        aria-label="Tutup filter"
                                        className="w-8 h-8 -mr-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="overflow-y-auto px-4 py-4">{renderFilterFields(true)}</div>
                                <div className="border-t border-gray-100 px-4 py-3 flex gap-2 shrink-0">
                                    {(hasActiveFilters || minPriceInput || maxPriceInput) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleResetFilters();
                                                closeMobileFilter();
                                            }}
                                            className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                                        >
                                            <RefreshCcw className="w-3.5 h-3.5" />
                                            Reset
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            applyFilters({
                                                min_price: minPriceInput ? minPriceInput.replace(/\D/g, '') : '',
                                                max_price: maxPriceInput ? maxPriceInput.replace(/\D/g, '') : '',
                                                page: 1,
                                            });
                                            closeMobileFilter();
                                        }}
                                        className={`${hasActiveFilters || minPriceInput || maxPriceInput ? 'flex-[1.5]' : 'w-full'} py-2.5 px-3 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-[0.98]`}
                                        style={primaryBtnStyle}
                                    >
                                        Lihat {totalProducts} Produk
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grow w-full min-w-0">
                        <div className="sticky top-16 z-30 -mx-4 mb-4 border-b border-gray-100 bg-white/95 px-4 py-2 backdrop-blur-sm sm:mb-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                            <div className="flex items-center gap-2 min-w-0">
                                <button
                                    type="button"
                                    onClick={openMobileFilter}
                                    className={`lg:hidden shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[11px] font-bold transition ${
                                        hasFilterBadges
                                            ? 'text-white shadow-xs'
                                            : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                    style={hasFilterBadges ? primaryBtnStyle : undefined}
                                    aria-label="Buka filter produk"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                                    <span>Filter</span>
                                    {hasFilterBadges && (
                                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-gray-900">
                                            {filterBadgeCount}
                                        </span>
                                    )}
                                </button>

                                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden scrollbar-hide">
                                    {sortOptions.map((opt) => {
                                        const isActive = filterSort === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleSortChange(opt.value)}
                                                className={chipClass(isActive)}
                                                style={isActive ? primaryBtnStyle : undefined}
                                            >
                                                {opt.icon === 'down' && (
                                                    <ArrowDown
                                                        className={`w-3 h-3 ${isActive ? 'text-white' : 'text-gray-400'}`}
                                                    />
                                                )}
                                                {opt.icon === 'up' && (
                                                    <ArrowUp
                                                        className={`w-3 h-3 ${isActive ? 'text-white' : 'text-gray-400'}`}
                                                    />
                                                )}
                                                <span>{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <Listbox
                                    value={
                                        perPageOptions.find((o) => Number(o.value) === Number(currentPerPage)) ||
                                        perPageOptions[1]
                                    }
                                    onChange={(opt) => handlePerPageChange(opt.value)}
                                >
                                    <div className="relative hidden shrink-0 sm:block">
                                        <Listbox.Button className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full font-bold text-[11px] sm:text-xs cursor-pointer transition bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80">
                                            <LayoutGrid className="w-3 h-3 text-gray-400 shrink-0" />
                                            <span>{currentPerPage} produk</span>
                                            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute right-0 top-full z-50 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 text-xs focus:outline-none">
                                                {perPageOptions.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.value}
                                                        value={opt}
                                                        className={({ active }) =>
                                                            `cursor-pointer px-3 py-2 flex items-center justify-between rounded-lg mx-1 transition-colors ${
                                                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                                            }`
                                                        }
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`text-[11px] sm:text-xs ${
                                                                        selected ? 'font-bold' : 'font-medium'
                                                                    }`}
                                                                    style={selected ? primaryTextStyle : undefined}
                                                                >
                                                                    {opt.value} produk
                                                                </span>
                                                                {selected && (
                                                                    <Check
                                                                        className="w-3.5 h-3.5"
                                                                        style={primaryTextStyle}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            {hasFilterBadges && (
                                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                    {filterStockStatus && (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-[11px] font-bold border border-gray-200">
                                            <Package className="w-2.5 h-2.5 shrink-0 opacity-80" />
                                            <span>
                                                {stockOptions.find((o) => o.value === filterStockStatus)?.label}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleStockStatusChange('')}
                                                className="hover:bg-gray-200 rounded-full p-0.5 transition -mr-0.5"
                                                title="Hapus filter status stok"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    )}
                                    {(safeFilters.min_price || safeFilters.max_price) && (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-[11px] font-bold border border-gray-200">
                                            <Banknote className="w-2.5 h-2.5 shrink-0 opacity-80" />
                                            <span>
                                                Rp{safeFilters.min_price || '0'}–{safeFilters.max_price || '∞'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={clearPriceFilters}
                                                className="hover:bg-gray-200 rounded-full p-0.5 transition -mr-0.5"
                                                title="Hapus filter harga"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    )}
                                    {filterSearch && (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-[11px] font-bold border border-gray-200">
                                            <Search className="w-2.5 h-2.5 shrink-0 opacity-80" />
                                            <span className="truncate max-w-[7rem] sm:max-w-none">"{filterSearch}"</span>
                                            <button
                                                type="button"
                                                onClick={() => applyFilters({ search: '' })}
                                                className="hover:bg-gray-200 rounded-full p-0.5 transition -mr-0.5"
                                                title="Hapus pencarian"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="xs"
                                        onClick={handleResetFilters}
                                        className="shrink-0 ml-auto rounded-full text-[10px] sm:text-[11px] font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200"
                                        title="Bersihkan semua filter"
                                        leftIcon={<RefreshCcw className="w-2.5 h-2.5" />}
                                    >
                                        Bersihkan
                                    </Button>
                                </div>
                            )}
                        </div>

                        {productsData.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                    {productsData.map((product, index) =>
                                        product ? (
                                            <ScrollReveal
                                                key={product.id ?? index}
                                                delay={(index % 2) * 80}
                                                direction="up"
                                            >
                                                <ProductCard
                                                    product={product}
                                                    whatsappNumber={waNumber}
                                                    whatsappTemplate={waTemplate}
                                                />
                                            </ScrollReveal>
                                        ) : null
                                    )}
                                </div>

                                <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100 space-y-2.5 sm:space-y-3">
                                    <div className="flex justify-center sm:justify-end">
                                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                                            Menampilkan{' '}
                                            <strong className="text-gray-600 font-bold">
                                                {products?.from || (productsData.length > 0 ? 1 : 0)}
                                            </strong>
                                            <span className="mx-0.5">–</span>
                                            <strong className="text-gray-600 font-bold">
                                                {products?.to || productsData.length}
                                            </strong>
                                            <span className="mx-1 text-gray-300">dari</span>
                                            {totalProducts}
                                        </span>
                                    </div>

                                    {lastPage > 1 && (
                                        <nav className="flex items-center justify-center gap-1 flex-wrap" aria-label="Pagination">
                                            {productsLinks.map((link, key) => {
                                                const rawLabel = link.label;
                                                const isPrev =
                                                    rawLabel.includes('Previous') || rawLabel.includes('&laquo;');
                                                const isNext =
                                                    rawLabel.includes('Next') || rawLabel.includes('&raquo;');
                                                const label = rawLabel
                                                    .replace(/&laquo;/g, '')
                                                    .replace(/&raquo;/g, '')
                                                    .replace(/Previous/g, '')
                                                    .replace(/Next/g, '')
                                                    .trim();

                                                // Ambil nomor halaman dari link.page atau fallback extract dari link.url
                                                let pageNumber: number | null = typeof link.page === 'number' ? link.page : null;
                                                if (pageNumber === null && link.url) {
                                                    try {
                                                        const parsed = new URL(link.url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
                                                        const p = parsed.searchParams.get('page');
                                                        if (p) pageNumber = parseInt(p, 10);
                                                    } catch {
                                                        const m = link.url.match(/[?&]page=(\d+)/);
                                                        if (m) pageNumber = parseInt(m[1], 10);
                                                    }
                                                }

                                                // Disabled jika tidak ada target halaman atau URL null (misal Previous di hal 1)
                                                if (pageNumber === null || !link.url) {
                                                    return (
                                                        <span
                                                            key={key}
                                                            className="inline-flex items-center justify-center min-w-8 h-8 sm:min-w-9 sm:h-9 px-2 text-[11px] sm:text-xs text-gray-300 bg-gray-50 rounded-full cursor-not-allowed select-none"
                                                        >
                                                            {isPrev ? (
                                                                 <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            ) : isNext ? (
                                                                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            ) : (
                                                                label
                                                            )}
                                                        </span>
                                                    );
                                                }

                                                const targetPage = pageNumber;
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => handlePageChange(targetPage)}
                                                        className={`inline-flex items-center justify-center min-w-8 h-8 sm:min-w-9 sm:h-9 px-2 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 ${
                                                            link.active
                                                                ? 'text-white shadow-sm border-transparent'
                                                                : 'bg-white text-gray-600 border border-gray-100 hover:text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                        style={link.active ? primaryBtnStyle : undefined}
                                                    >
                                                        {isPrev ? (
                                                            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                        ) : isNext ? (
                                                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                        ) : (
                                                            label
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </nav>
                                    )}
                                </div>
                            </>
                        ) : (
                            <ScrollReveal direction="up">
                                <div className="bg-white p-12 sm:p-16 text-center rounded-2xl border border-gray-200 shadow-xs max-w-md mx-auto space-y-4">
                                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                        Produk Tidak Ditemukan
                                    </h3>
                                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                        Tidak ada produk yang sesuai dengan filter yang Anda tentukan. Coba ubah atau
                                        bersihkan kriteria pencarian.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        onClick={handleResetFilters}
                                        leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}
                                    >
                                        Reset Filter
                                    </Button>
                                </div>
                            </ScrollReveal>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
