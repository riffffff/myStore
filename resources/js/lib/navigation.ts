import { router } from '@inertiajs/react';

// Set of page paths that have already been visited in this browser session
const visitedPaths = new Set<string>();

/**
 * Clean and normalize a path: strips query params, hash, and trailing slashes.
 * e.g. "/produk?category=1" -> "/produk", "/" -> "/"
 */
export function getCleanPath(rawPath?: string): string {
    if (typeof window === 'undefined') return '/';
    const p = rawPath || window.location.pathname;
    return p.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
}

// Current active path
let activePath = typeof window !== 'undefined' ? getCleanPath() : '/';

if (typeof window !== 'undefined') {
    // When user starts navigating to a new page, commit current page as visited
    router.on('start', () => {
        if (activePath) {
            visitedPaths.add(activePath);
        }
    });

    // When the navigation completes, record previous path and update active path
    router.on('navigate', (event) => {
        if (activePath) {
            visitedPaths.add(activePath);
        }
        const nextUrl = event.detail.page?.url || window.location.pathname;
        activePath = getCleanPath(nextUrl);
    });
}

/**
 * Returns true if the CURRENT page is being opened for the FIRST time in this session (or after refresh).
 * Returns false if the user has already visited this page previously in this session.
 */
export function isCurrentPageFirstVisit(): boolean {
    if (typeof window === 'undefined') return true;
    const current = getCleanPath();
    return !visitedPaths.has(current);
}

/**
 * Backwards compatibility alias
 */
export function isFirstPageLoad(): boolean {
    return isCurrentPageFirstVisit();
}
