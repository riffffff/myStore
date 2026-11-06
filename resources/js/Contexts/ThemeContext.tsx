import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundDark: string;
    text: string;
    textLight: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    borderRadius: string;
    fontFamily: string;
    darkModeEnabled: boolean;

    // Component-based colors
    headerBg: string;
    headerText: string;
    headerActive: string;
    footerBg: string;
    footerText: string;
    footerAccent: string;
    heroBg: string;
    heroText: string;
    heroBtn: string;
    heroBtnText: string;
    cardProductBg: string;
    cardProductBorder: string;
    cardProductText: string;
    cardProductPrice: string;
    priceColor: string;
    cardProductBtn: string;
    cardArticleBg: string;
    cardArticleBorder: string;
    cardArticleTag: string;
    cardArticleTitle: string;
    cardArticleText: string;
    pageBg: string;
    pageText: string;
    primaryBtn: string;
    primaryBtnText: string;
}

export interface ThemeContextType {
    colors: ThemeColors;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_THEME: ThemeColors = {
    primary:         '#0D9488',
    secondary:       '#8B5CF6',
    accent:          '#0D9488',
    background:      '#FFFFFF',
    backgroundDark:  '#111827',
    text:            '#1F2937',
    textLight:       '#6B7280',
    success:         '#10B981',
    error:           '#EF4444',
    warning:         '#F59E0B',
    info:            '#3B82F6',
    borderRadius:    '0.5rem',
    fontFamily:      "'Inter', system-ui, sans-serif",
    darkModeEnabled: true,

    // Component-based defaults
    headerBg:           '#333333',
    headerText:         '#FFFFFF',
    headerActive:       '#0D9488',
    footerBg:           '#333333',
    footerText:         '#FFFFFF',
    footerAccent:       '#0D9488',
    heroBg:             '#F1F1F1',
    heroText:           '#262626',
    heroBtn:            '#0D9488',
    heroBtnText:        '#FFFFFF',
    cardProductBg:      '#FFFFFF',
    cardProductBorder:  '#E5E7EB',
    cardProductText:    '#262626',
    cardProductPrice:   '#E63854',
    priceColor:         '#E63854',
    cardProductBtn:     '#0D9488',
    cardArticleBg:      '#FFFFFF',
    cardArticleBorder:  '#E5E7EB',
    cardArticleTag:     '#0D9488',
    cardArticleTitle:   '#262626',
    cardArticleText:    '#4B5563',
    pageBg:             '#FFFFFF',
    pageText:           '#262626',
    primaryBtn:         '#0D9488',
    primaryBtnText:     '#FFFFFF',
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType>({
    colors:         DEFAULT_THEME,
    isDarkMode:     false,
    toggleDarkMode: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { theme } = usePage<PageProps>().props;

    // Merge server colors with defaults (server always wins)
    const colors: ThemeColors = useMemo(() => {
        const t = (theme ?? {}) as Record<string, any>;
        return {
            ...DEFAULT_THEME,
            ...t,
            primary:           t.primary           ?? t.primary_color           ?? DEFAULT_THEME.primary,
            secondary:         t.secondary         ?? t.secondary_color         ?? DEFAULT_THEME.secondary,
            accent:            t.accent            ?? t.accent_color            ?? DEFAULT_THEME.accent,
            background:        t.background        ?? t.page_bg_color           ?? t.background_color ?? DEFAULT_THEME.background,
            backgroundDark:    t.backgroundDark    ?? t.background_dark_color    ?? DEFAULT_THEME.backgroundDark,
            text:              t.text              ?? t.page_text_color         ?? t.text_color       ?? DEFAULT_THEME.text,
            textLight:         t.textLight         ?? t.text_light_color        ?? DEFAULT_THEME.textLight,
            fontFamily:        t.fontFamily        ?? t.font_family             ?? DEFAULT_THEME.fontFamily,
            borderRadius:      t.borderRadius      ?? t.border_radius           ?? DEFAULT_THEME.borderRadius,
            headerBg:          t.headerBg          ?? t.header_bg_color         ?? DEFAULT_THEME.headerBg,
            headerText:        t.headerText        ?? t.header_text_color       ?? DEFAULT_THEME.headerText,
            headerActive:      t.headerActive      ?? t.header_active_color     ?? DEFAULT_THEME.headerActive,
            footerBg:          t.footerBg          ?? t.footer_bg_color         ?? DEFAULT_THEME.footerBg,
            footerText:        t.footerText        ?? t.footer_text_color       ?? DEFAULT_THEME.footerText,
            footerAccent:      t.footerAccent      ?? t.footer_accent_color     ?? DEFAULT_THEME.footerAccent,
            heroBg:            t.heroBg            ?? t.hero_bg_color           ?? DEFAULT_THEME.heroBg,
            heroText:          t.heroText          ?? t.hero_text_color         ?? DEFAULT_THEME.heroText,
            heroBtn:           t.heroBtn           ?? t.hero_btn_color          ?? DEFAULT_THEME.heroBtn,
            heroBtnText:       t.heroBtnText       ?? t.hero_btn_text_color     ?? DEFAULT_THEME.heroBtnText,
            cardProductBg:     t.cardProductBg     ?? t.card_product_bg_color   ?? DEFAULT_THEME.cardProductBg,
            cardProductBorder: t.cardProductBorder ?? t.card_product_border_color ?? DEFAULT_THEME.cardProductBorder,
            cardProductText:   t.cardProductText   ?? t.card_product_text_color ?? DEFAULT_THEME.cardProductText,
            cardProductPrice:  '#E63854',
            priceColor:        '#E63854',
            cardProductBtn:    t.cardProductBtn    ?? t.card_product_btn_color  ?? (t.primary ?? t.primary_color ?? DEFAULT_THEME.cardProductBtn),
            cardArticleBg:     t.cardArticleBg     ?? t.card_article_bg_color   ?? DEFAULT_THEME.cardArticleBg,
            cardArticleBorder: t.cardArticleBorder ?? t.card_article_border_color ?? DEFAULT_THEME.cardArticleBorder,
            cardArticleTag:    t.cardArticleTag    ?? t.card_article_tag_color  ?? (t.primary ?? t.primary_color ?? DEFAULT_THEME.cardArticleTag),
            cardArticleTitle:  t.cardArticleTitle  ?? t.card_article_title_color ?? DEFAULT_THEME.cardArticleTitle,
            cardArticleText:   t.cardArticleText   ?? t.card_article_text_color ?? DEFAULT_THEME.cardArticleText,
            pageBg:            t.pageBg            ?? t.page_bg_color           ?? t.background_color ?? DEFAULT_THEME.pageBg,
            pageText:          t.pageText          ?? t.page_text_color         ?? t.text_color       ?? DEFAULT_THEME.pageText,
            primaryBtn:        t.primaryBtn        ?? t.primary_btn_color       ?? (t.primary ?? t.primary_color ?? DEFAULT_THEME.primaryBtn),
            primaryBtnText:    t.primaryBtnText    ?? t.primary_btn_text_color  ?? DEFAULT_THEME.primaryBtnText,
        };
    }, [theme]);

    // ── Dark mode state ────────────────────────────────────────────────────
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        // Restore user preference from localStorage (if admin allows dark mode)
        if (!colors.darkModeEnabled) return false;
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('paitech_dark_mode') === 'true';
    });

    const toggleDarkMode = useCallback(() => {
        if (!colors.darkModeEnabled) return;
        setIsDarkMode((prev) => {
            const next = !prev;
            localStorage.setItem('paitech_dark_mode', String(next));
            return next;
        });
    }, [colors.darkModeEnabled]);

function getContrastColor(hexColor: string): string {
    const hex = (hexColor || '#3B82F6').replace('#', '');
    if (hex.length !== 6 && hex.length !== 3) return '#ffffff';
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 165 ? '#111827' : '#ffffff';
}

    // ── Inject CSS variables into <html> ──────────────────────────────────
    useEffect(() => {
        const root = document.documentElement;

        // Base & generic
        root.style.setProperty('--color-primary',          colors.primary);
        root.style.setProperty('--color-primary-contrast', getContrastColor(colors.primary));
        root.style.setProperty('--color-secondary',        colors.secondary);
        root.style.setProperty('--color-accent',           colors.accent);
        root.style.setProperty('--color-bg',               colors.background);
        root.style.setProperty('--color-bg-dark',          colors.backgroundDark);
        root.style.setProperty('--color-text',             colors.text);
        root.style.setProperty('--color-text-light',       colors.textLight);
        root.style.setProperty('--color-success',          colors.success);
        root.style.setProperty('--color-error',            colors.error);
        root.style.setProperty('--color-warning',          colors.warning);
        root.style.setProperty('--color-info',             colors.info);
        root.style.setProperty('--border-radius',          colors.borderRadius);
        root.style.setProperty('--font-family',            colors.fontFamily);

        // Component: Header
        root.style.setProperty('--header-bg',              colors.headerBg);
        root.style.setProperty('--header-text',            colors.headerText);
        root.style.setProperty('--header-active',          colors.headerActive);

        // Component: Footer
        root.style.setProperty('--footer-bg',              colors.footerBg);
        root.style.setProperty('--footer-text',            colors.footerText);
        root.style.setProperty('--footer-accent',          colors.footerAccent);

        // Component: Hero Section
        root.style.setProperty('--hero-bg',                colors.heroBg);
        root.style.setProperty('--hero-text',              colors.heroText);
        root.style.setProperty('--hero-btn',               colors.heroBtn);
        root.style.setProperty('--hero-btn-text',          colors.heroBtnText);

        // Component: Card Product
        root.style.setProperty('--card-product-bg',        colors.cardProductBg);
        root.style.setProperty('--card-product-border',    colors.cardProductBorder);
        root.style.setProperty('--card-product-text',      colors.cardProductText);
        root.style.setProperty('--card-product-price',     colors.cardProductPrice || '#E63854');
        root.style.setProperty('--price-color',            colors.priceColor || '#E63854');
        root.style.setProperty('--card-product-btn',       colors.cardProductBtn);
        // Auto-contrast: teks selalu terbaca apapun warna button-nya
        root.style.setProperty('--card-product-btn-text',  getContrastColor(colors.cardProductBtn));

        // Component: Card Article
        root.style.setProperty('--card-article-bg',        colors.cardArticleBg);
        root.style.setProperty('--card-article-border',    colors.cardArticleBorder);
        root.style.setProperty('--card-article-tag',       colors.cardArticleTag);
        root.style.setProperty('--card-article-tag-text',  getContrastColor(colors.cardArticleTag));
        root.style.setProperty('--card-article-title',     colors.cardArticleTitle);
        root.style.setProperty('--card-article-text',      colors.cardArticleText);

        // Component: Page & Global Buttons
        root.style.setProperty('--page-bg',                colors.pageBg);
        root.style.setProperty('--page-text',              colors.pageText);
        root.style.setProperty('--primary-btn',            colors.primaryBtn);
        root.style.setProperty('--primary-btn-text',       getContrastColor(colors.primaryBtn));
        // Hero btn text juga auto-contrast
        root.style.setProperty('--hero-btn-text',          getContrastColor(colors.heroBtn));
    }, [colors]);

    // ── Toggle dark class on <html> ───────────────────────────────────────
    useEffect(() => {
        const root = document.documentElement;

        if (isDarkMode && colors.darkModeEnabled) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode, colors.darkModeEnabled]);

    // ── If admin disables dark mode, force light ──────────────────────────
    useEffect(() => {
        if (!colors.darkModeEnabled) {
            setIsDarkMode(false);
        }
    }, [colors.darkModeEnabled]);

    const value = useMemo<ThemeContextType>(
        () => ({ colors, isDarkMode, toggleDarkMode }),
        [colors, isDarkMode, toggleDarkMode],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Gunakan hook ini untuk mengakses theme di semua komponen.
 *
 * @example
 * const { colors, isDarkMode, toggleDarkMode } = useTheme();
 */
export function useTheme(): ThemeContextType {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return ctx;
}

export default ThemeContext;
