import { Config } from 'ziggy-js';
import { StockStatus } from './store';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    email_verified_at?: string;
}

export interface ShopSettingsShared {
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
}

/** Theme colors & options shared from the server via Inertia. */
export interface ThemeShared {
    primary:         string;
    secondary:       string;
    accent:          string;
    background:      string;
    backgroundDark:  string;
    text:            string;
    textLight:       string;
    success:         string;
    error:           string;
    warning:         string;
    info:            string;
    borderRadius:    string;
    fontFamily:      string;
    darkModeEnabled: boolean;

    // Component-based colors
    headerBg?:           string;
    headerText?:         string;
    headerActive?:       string;
    footerBg?:           string;
    footerText?:         string;
    footerAccent?:       string;
    heroBg?:             string;
    heroText?:           string;
    heroBtn?:            string;
    heroBtnText?:        string;
    cardProductBg?:      string;
    cardProductBorder?:  string;
    cardProductText?:    string;
    cardProductPrice?:   string;
    cardProductBtn?:     string;
    cardArticleBg?:      string;
    cardArticleBorder?:  string;
    cardArticleTag?:     string;
    cardArticleTitle?:   string;
    cardArticleText?:    string;
    pageBg?:             string;
    pageText?:           string;
    primaryBtn?:         string;
    primaryBtnText?:     string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash: {
        success: string | null;
        error:   string | null;
        'cart.flash'?: string | null;
        review_submitted?: boolean | null;
    };
    shopSettings: ShopSettingsShared;
    theme: ThemeShared;
};

export type { StockStatus };
