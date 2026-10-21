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
    const colors: ThemeColors = useMemo(
        () => ({ ...DEFAULT_THEME, ...(theme ?? {}) }),
        [theme],
    );

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
