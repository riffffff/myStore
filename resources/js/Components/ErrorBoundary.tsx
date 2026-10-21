import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component to catch JavaScript errors anywhere in the child component tree
 * Prevents full app crash and shows user-friendly error message
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // You can also log the error to an error reporting service here
        // e.g., Sentry, LogRocket, etc.

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center space-y-6">
                            {/* Icon */}
                            <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-rose-600" />
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-stone-900">
                                    Oops! Terjadi Kesalahan
                                </h1>
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    Maaf, ada sesuatu yang tidak beres. Tim kami sudah diberitahu dan akan segera
                                    memperbaikinya.
                                </p>
                            </div>

                            {/* Error details (only in development) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="bg-stone-50 rounded-lg p-4 text-left">
                                    <p className="text-xs font-mono text-stone-700 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-700">
                                                Component Stack
                                            </summary>
                                            <pre className="mt-2 text-xs font-mono text-stone-600 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={this.handleReset}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-mahogany-800 text-white font-bold text-sm hover:bg-mahogany-700 transition"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Coba Lagi</span>
                                </button>
                                <button
                                    onClick={this.handleGoHome}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-sm hover:bg-stone-50 transition"
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Ke Beranda</span>
                                </button>
                            </div>

                            {/* Support info */}
                            <p className="text-xs text-stone-500">
                                Jika masalah berlanjut, silakan{' '}
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-mahogany-700 hover:text-mahogany-800 font-semibold underline"
                                >
                                    hubungi kami
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
