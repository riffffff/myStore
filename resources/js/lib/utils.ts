/**
 * Format number as Indonesian Rupiah currency
 * @param val - Number or string to format
 * @returns Formatted currency string (e.g., "Rp 100.000")
 */
export function formatRupiah(val: number | string | null | undefined): string {
    if (val === null || val === undefined) return 'Rp 0';
    const num = typeof val === 'number' ? val : parseFloat(String(val));
    const validNum = isNaN(num) ? 0 : num;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(validNum);
}

/**
 * Construct proper image URL from storage path
 * Handles absolute URLs, root-relative URLs, and storage paths
 * @param url - Image URL or path from database
 * @param fallback - Fallback image URL if url is null/empty
 * @returns Proper image URL
 */
export function getImageUrl(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    
    // Already absolute URL (http/https) or root-relative (/)
    if (url.startsWith('http') || url.startsWith('/')) {
        return url;
    }
    
    // Relative storage path - prepend /storage/
    return `/storage/${url}`;
}

/**
 * Build WhatsApp chat URL with pre-filled message
 * @param config - WhatsApp configuration
 * @param config.phoneNumber - WhatsApp phone number (e.g., "6281234567890")
 * @param config.message - Message text to send
 * @returns WhatsApp URL
 */
export function buildWhatsAppUrl(config: {
    phoneNumber: string;
    message: string;
}): string {
    const { phoneNumber, message } = config;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Build WhatsApp message for single product
 * @param config - Product and shop configuration
 * @returns WhatsApp URL with pre-filled product message
 */
export function buildWhatsAppProductUrl(config: {
    phoneNumber: string;
    template?: string;
    productName: string;
    productPrice: string;
}): string {
    const { phoneNumber, template, productName, productPrice } = config;
    
    const message = template
        ? template
            .replaceAll('{product_name}', productName)
            .replaceAll('{product_price}', productPrice)
        : `Halo, saya tertarik dengan produk ${productName} seharga ${productPrice}. Apakah masih tersedia?`;
    
    return buildWhatsAppUrl({ phoneNumber, message });
}

/**
 * Format date to Indonesian locale
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions (default: day, month, year)
 * @returns Formatted date string (e.g., "20 September 2026")
 */
export function formatDate(
    date: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('id-ID', options || defaultOptions);
    } catch {
        return '';
    }
}

/**
 * Safely filter array, removing null/undefined values
 * Returns empty array if input is not array or is null/undefined
 * @param data - Array data that might be null/undefined
 * @returns Filtered array with non-null values
 */
export function safeArray<T>(data: T[] | null | undefined): NonNullable<T>[] {
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is NonNullable<T> => item != null);
}

/**
 * Get primary image from array of images, or first image, or fallback
 * @param images - Array of images with optional is_primary flag
 * @param fallback - Fallback image URL
 * @returns Image URL
 */
export function getPrimaryImageUrl(
    images: Array<{ url?: string; is_primary?: boolean }> | null | undefined,
    fallback: string
): string {
    const safeImages = safeArray(images);
    if (safeImages.length === 0) return fallback;
    
    const primaryImage = safeImages.find(img => img?.is_primary) || safeImages[0];
    return getImageUrl(primaryImage?.url, fallback);
}
