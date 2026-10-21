import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthModal from '@/Components/Public/AuthModal';
import { PageProps } from '@/types';

export default function Register() {
    const [isOpen, setIsOpen] = useState(true);
    const { shopSettings } = usePage<PageProps>().props;
    const shopName = shopSettings?.shop_name ?? '';

    const handleClose = () => {
        setIsOpen(false);
        if (typeof window !== 'undefined') {
            window.location.href = route('home');
        }
    };

    return (
        <PublicLayout>
            <Head title={shopName} />
            <AuthModal
                isOpen={isOpen}
                onClose={handleClose}
                initialMode="register"
            />
        </PublicLayout>
    );
}
