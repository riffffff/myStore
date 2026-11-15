import { FormEvent, useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Star } from 'lucide-react';
import Button from '@/Components/Button';

const RATING_LABELS: Record<number, string> = {
    1: 'Sangat Buruk',
    2: 'Buruk',
    3: 'Cukup',
    4: 'Baik',
    5: 'Sangat Baik',
};

interface ReviewFormProps {
    productId: number;
    productName?: string;
    defaultName?: string;
    onSuccess?: () => void;
    onAutoClose?: () => void;
    onSubmittedChange?: (submitted: boolean) => void;
    autoCloseSeconds?: number;
    compact?: boolean;
}

export default function ReviewForm({
    productId,
    productName,
    defaultName,
    onSuccess,
    onAutoClose,
    onSubmittedChange,
    autoCloseSeconds,
    compact = false,
}: ReviewFormProps) {
    const authUser = (usePage().props as any).auth?.user;
    const [submitted, setSubmitted] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState<number>(autoCloseSeconds ?? 0);

    useEffect(() => {
        if (!submitted || !autoCloseSeconds || autoCloseSeconds <= 0) return;

        setSecondsLeft(autoCloseSeconds);
        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onAutoClose?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [submitted, autoCloseSeconds]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_id: productId,
        name: defaultName || authUser?.name || '',
        city: '',
        rating: 5,
        review: '',
        website: '', // honeypot anti-spam
    });

    const activeRating = data.rating;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('reviews.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                onSubmittedChange?.(true);
                reset('review', 'city', 'website');
                setData('rating', 5);
                clearErrors();
                onSuccess?.();
            },
        });
    };

    if (submitted) {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-emerald-900">Terima kasih telah memberikan ulasan!</p>
                <p className="text-xs text-emerald-700">
                    Masukan Anda sangat berarti untuk meningkatkan layanan kami.
                </p>
                {autoCloseSeconds && autoCloseSeconds > 0 ? (
                    <p className="text-[11px] font-semibold text-emerald-600 pt-1 tabular-nums">
                        Menutup otomatis dalam {secondsLeft} detik...
                    </p>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setSubmitted(false);
                            onSubmittedChange?.(false);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer pt-1"
                    >
                        Tulis ulasan lagi
                    </button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={compact ? 'space-y-3.5' : 'space-y-4'}>
            {((errors as any).rate_limit || errors.product_id) && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                    {(errors as any).rate_limit || errors.product_id}
                </div>
            )}

            {productName && (
                <div className="text-xs text-gray-600 bg-black/3 px-3 py-2 rounded-lg border border-gray-200/70">
                    Produk: <span className="font-bold text-gray-900">{productName}</span>
                </div>
            )}

            {/* Honeypot anti-spam (disembunyikan dari pengguna) */}
            <div className="hidden" aria-hidden="true">
                <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={data.website}
                    onChange={(e) => setData('website', e.target.value)}
                />
            </div>

            {/* Rating Bintang 5 ala Shopee */}
            <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                    Kualitas Produk <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const filled = star <= activeRating;
                            return (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    aria-label={`Beri ${star} bintang`}
                                    className="p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                                >
                                    <Star
                                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                            filled
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-gray-100 text-gray-300'
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        {RATING_LABELS[activeRating]}
                    </span>
                </div>
                {errors.rating && <p className="text-xs text-rose-600">{errors.rating}</p>}
            </div>

            {/* Nama & Kota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nama Anda <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                    />
                    {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                        Kota (Opsional)
                    </label>
                    <input
                        type="text"
                        maxLength={100}
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        placeholder="Contoh: Bandung"
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                    />
                    {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                </div>
            </div>

            {/* Textarea Ulasan */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                        Ulasan Anda <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400">Min. 10 karakter</span>
                </div>
                <textarea
                    rows={compact ? 3 : 4}
                    required
                    minLength={10}
                    maxLength={2000}
                    value={data.review}
                    onChange={(e) => setData('review', e.target.value)}
                    placeholder="Bagikan pendapat Anda tentang kualitas, rasa, kemasan, atau pengalaman belanja produk ini..."
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
                />
                {errors.review && <p className="text-xs text-rose-600 mt-1">{errors.review}</p>}
            </div>

            <div className="flex justify-end pt-1">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={processing}
                    loadingText="Mengirim..."
                >
                    Kirim Ulasan
                </Button>
            </div>
        </form>
    );
}

