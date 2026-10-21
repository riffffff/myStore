import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number; // ms, default 3500
}

interface ToastContextValue {
    toasts: Toast[];
    toast: (message: string, type?: ToastType, duration?: number) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const toast = useCallback((message: string, type: ToastType = 'success', duration = 3500) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts(prev => [...prev, { id, message, type, duration }]);
        timers.current[id] = setTimeout(() => dismiss(id), duration);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}
