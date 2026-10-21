import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, Toast, ToastType } from '@/Contexts/ToastContext';

/* ─── Icon per type ─── */
const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 shrink-0" />,
    error:   <XCircle     className="w-4 h-4 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
    info:    <Info        className="w-4 h-4 shrink-0" />,
};

/* ─── Color palette per type ─── */
const palette: Record<ToastType, { bar: string; icon: string }> = {
    success: { bar: 'bg-teal-500',  icon: 'text-teal-400' },
    error:   { bar: 'bg-rose-500',  icon: 'text-rose-400' },
    warning: { bar: 'bg-amber-400', icon: 'text-amber-400' },
    info:    { bar: 'bg-blue-500',  icon: 'text-blue-400' },
};

/* ─── Single Toast Item ─── */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const [visible, setVisible] = useState(false);
    const { bar, icon } = palette[toast.type];

    // Mount → show (triggers CSS transition in)
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    // Before removing → animate out
    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onDismiss, 300);
    };

    return (
        <div
            role="alert"
            aria-live="polite"
            style={{
                transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
            }}
            className="relative flex items-center gap-3 w-full max-w-sm bg-[#1C1C1E] text-white rounded-xl px-4 py-3 shadow-2xl border border-white/[0.06] overflow-hidden"
        >
            {/* Left color bar */}
            <span className={`absolute left-0 top-0 h-full w-[3px] ${bar} rounded-l-xl`} />

            {/* Icon */}
            <span className={`ml-1 ${icon}`}>{icons[toast.type]}</span>

            {/* Message */}
            <p className="flex-1 text-[13px] font-medium leading-snug text-white/90">
                {toast.message}
            </p>

            {/* Dismiss button */}
            <button
                type="button"
                onClick={handleDismiss}
                aria-label="Tutup"
                className="text-white/30 hover:text-white/70 transition-colors shrink-0 -mr-0.5"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

/* ─── Toaster (portal to body) ─── */
export default function Toaster() {
    const { toasts, toast, dismiss } = useToast();
    const lastFlashKeyRef = useRef<string | null>(null);

    const handleFlash = useCallback((flash: any) => {
        if (!flash) return;

        const successMsg = flash.success || flash['cart.flash'];
        const errorMsg = flash.error;
        const currentKey = `${successMsg || ''}__${errorMsg || ''}`;

        if (!currentKey.trim() || currentKey === lastFlashKeyRef.current) return;
        lastFlashKeyRef.current = currentKey;

        // Clean emoticons & emojis
        const stripEmoji = (str: string) =>
            str
                .replace(
                    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}]/gu,
                    ''
                )
                .replace(/^[^\w\s]+/, '')
                .trim();

        if (successMsg) {
            toast(stripEmoji(String(successMsg)), 'success');
        } else if (errorMsg) {
            toast(stripEmoji(String(errorMsg)), 'error');
        }
    }, [toast]);

    // Auto-listen to Inertia flash props for all CUD operations
    useEffect(() => {
        // 1. Initial page load
        try {
            const el = document.getElementById('app');
            if (el?.dataset?.page) {
                const initialData = JSON.parse(el.dataset.page);
                handleFlash(initialData?.props?.flash);
            }
        } catch {
            // ignore JSON parse errors
        }

        // 2. Subsequent Inertia visits & requests
        const unregister = router.on('success', (event) => {
            const flash = (event.detail.page.props as any)?.flash;
            handleFlash(flash);
        });

        return () => {
            unregister();
        };
    }, [handleFlash]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            aria-label="Notifications"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2 w-full px-4 pointer-events-none"
            style={{ maxWidth: 420 }}
        >
            {toasts.map(t => (
                <div key={t.id} className="w-full pointer-events-auto">
                    <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
                </div>
            ))}
        </div>,
        document.body
    );
}
