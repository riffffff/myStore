export type StockStatus = 'available' | 'preorder' | 'out_of_stock';

export interface CartItemSummary {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal_price: number;
    product: {
        id: number;
        name: string;
        slug: string | null;
        stock_status: StockStatus;
        image_url: string | null;
    };
}

export interface CartSummary {
    id: number;
    total_quantity: number;
    total_price: number;
    items: CartItemSummary[];
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    category?: string | null;
    description: string;
    short_description: string;
    price: number;
    stock_status: StockStatus;
    dimensions?: Array<{ label: string; value: string }> | null;
    materials?: Array<{ name: string }> | null;
    finishes?: Array<{ option: string }> | null;
    tags?: string[] | null;
    weight_kg?: number | null;
    assembly_required?: boolean;
    warranty_months?: number | null;
    is_published?: boolean;
    images: ProductImage[];
    views_count?: number;
    created_at: string;
    updated_at?: string;
}

export interface ProductImage {
    id: number;
    product_id?: number;
    url: string;
    is_primary: boolean;
    sort_order?: number;
    created_at?: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    is_hero: boolean;
    is_published?: boolean;
    published_at: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Review {
    id: number;
    product_id?: number | null;
    name: string;
    city: string;
    rating: 1 | 2 | 3 | 4 | 5;
    review: string;
    is_approved?: boolean;
    created_at?: string;
}

export interface ShopSetting {
    id?: number;
    shop_name?: string | null;
    description?: string | null;
    logo?: string | null;
    logo_dark?: string | null;
    favicon?: string | null;
    logo_url?: string;
    logo_dark_url?: string;
    favicon_url?: string;
    qris_image?: string | null;
    qris_image_url?: string | null;
    qris_account_name?: string | null;
    address?: string | null;
    whatsapp_number: string;
    whatsapp_template: string;
    operating_hours?: string | null;
    hero_banner_text_1?: string | null;
    hero_banner_text_2?: string | null;
    hero_banner_bg?: string | null;
    shipping_areas?: string[] | null;
    shipping_estimate_days?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type PaymentMethod = 'cod' | 'qris';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal_price: number;
    product?: {
        id: number;
        name: string;
        slug?: string | null;
        image_url?: string | null;
    } | null;
}

export interface Order {
    id: number;
    order_number: string;
    user_id?: number | null;
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    payment_method: PaymentMethod;
    payment_proof?: string | null;
    payment_proof_url?: string | null;
    status: OrderStatus;
    total_price: number;
    notes?: string | null;
    items: OrderItem[];
    created_at: string;
    updated_at?: string;
}
