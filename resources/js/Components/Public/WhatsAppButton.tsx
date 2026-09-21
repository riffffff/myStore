import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    href: string;
    children?: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'outline';
    fullWidth?: boolean;
    showIcon?: boolean;
}

/**
 * WhatsApp button component with consistent styling
 * Eliminates inline styles and prepares for theme system
 */
export default function WhatsAppButton({
    href,
    children = 'WhatsApp',
    className = '',
    size = 'md',
    variant = 'solid',
    fullWidth = false,
    showIcon = true,
}: WhatsAppButtonProps) {
    // Size variants
    const sizeClasses = {
        sm: 'px-3 py-2 text-xs gap-1.5',
        md: 'px-5 py-3.5 text-sm gap-2',
        lg: 'px-6 py-4 text-base gap-2.5',
    };

    // Icon sizes
    const iconSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    // Variant styles - using Tailwind classes instead of inline styles
    const variantClasses = {
        solid: 'bg-whatsapp text-white hover:bg-whatsapp-dark active:bg-whatsapp-darker shadow-sm',
        outline: 'border-2 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                inline-flex items-center justify-center
                rounded-xl font-bold
                transition-all duration-200
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${widthClass}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
            aria-label="WhatsApp"
        >
            {showIcon && <MessageCircle className={iconSizes[size]} />}
            <span>{children}</span>
        </a>
    );
}
