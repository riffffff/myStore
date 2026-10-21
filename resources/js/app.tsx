import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import ErrorBoundary from './Components/ErrorBoundary';
import { ToastProvider } from './Contexts/ToastContext';
import Toaster from './Components/UI/Toaster';

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const appElement = (
            <ErrorBoundary>
                <ToastProvider>
                    <App {...props} />
                    <Toaster />
                </ToastProvider>
            </ErrorBoundary>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, appElement);
            return;
        }

        createRoot(el).render(appElement);
    },
    progress: {
        color: '#4B5563',
    },
});
