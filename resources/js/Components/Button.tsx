import React, { forwardRef } from 'react';
import { Link, InertiaLinkProps } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'danger-outline'
    | 'success'
    | 'dark';

export type ButtonSize =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'icon-xs'
    | 'icon-sm'
    | 'icon'
    | 'icon-lg';

interface BaseButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    loadingText?: React.ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

// Props when rendered as a standard <button>
export type ButtonAsButton = BaseButtonProps &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
        href?: undefined;
        external?: never;
    };

// Props when rendered as an Inertia <Link>
export type ButtonAsLink = BaseButtonProps &
    Omit<InertiaLinkProps, keyof BaseButtonProps | 'href'> & {
        href: string;
        external?: false;
        disabled?: boolean;
    };

// Props when rendered as an external <a> tag
export type ButtonAsExternalLink = BaseButtonProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps | 'href'> & {
        href: string;
        external: true;
        disabled?: boolean;
    };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternalLink;

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-xs focus-visible:ring-accent-600',
    secondary:
        'border border-accent-200 bg-accent-50 text-accent-800 hover:bg-accent-100 hover:border-accent-300 active:bg-accent-200/80 shadow-xs focus-visible:ring-accent-500',
    outline:
        'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-400 active:bg-stone-100 shadow-2xs focus-visible:ring-stone-400',
    ghost:
        'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 focus-visible:ring-stone-400',
    danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs focus-visible:ring-rose-500',
    'danger-outline':
        'border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 active:bg-rose-200/60 shadow-2xs focus-visible:ring-rose-500',
    success:
        'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs focus-visible:ring-emerald-500',
    dark:
        'bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950 shadow-xs focus-visible:ring-primary-700',
};

const sizeClasses: Record<ButtonSize, string> = {
    xs: 'h-7 px-2.5 text-[11px] font-semibold rounded-lg gap-1',
    sm: 'h-8 sm:h-9 px-3 text-xs font-semibold rounded-xl gap-1.5',
    md: 'h-10 sm:h-11 px-4 text-sm font-bold rounded-xl gap-2',
    lg: 'h-12 sm:h-13 px-6 text-base font-extrabold rounded-2xl gap-2.5',
    'icon-xs': 'h-7 w-7 p-0 rounded-lg shrink-0 justify-center',
    'icon-sm': 'h-8 sm:h-8.5 w-8 sm:w-8.5 p-0 rounded-xl shrink-0 justify-center',
    icon: 'h-10 w-10 p-0 rounded-xl shrink-0 justify-center',
    'icon-lg': 'h-12 w-12 p-0 rounded-2xl shrink-0 justify-center',
};

const iconSizes: Record<ButtonSize, string> = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    'icon-xs': 'h-3.5 w-3.5',
    'icon-sm': 'h-4 w-4',
    icon: 'h-5 w-5',
    'icon-lg': 'h-6 w-6',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    function Button(props, ref) {
        const {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            children,
            className = '',
            disabled = false,
            ...rest
        } = props;

        const isDisabled = disabled || isLoading;

        const baseClasses =
            'inline-flex items-center justify-center font-medium select-none ' +
            'transition-all duration-200 cursor-pointer whitespace-nowrap ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
            'active:scale-[0.98] ' +
            'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:transform-none';

        const combinedClasses = [
            baseClasses,
            variantClasses[variant] || variantClasses.primary,
            sizeClasses[size] || sizeClasses.md,
            fullWidth ? 'w-full' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const spinnerIcon = (
            <Loader2 className={`${iconSizes[size] || 'h-4 w-4'} animate-spin shrink-0`} />
        );

        const content = (
            <>
                {isLoading ? (
                    <>
                        {spinnerIcon}
                        {loadingText ? <span>{loadingText}</span> : children ? <span>{children}</span> : null}
                    </>
                ) : (
                    <>
                        {leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>}
                        {children && <span>{children}</span>}
                        {rightIcon && <span className="shrink-0 inline-flex items-center">{rightIcon}</span>}
                    </>
                )}
            </>
        );

        // Render as external <a> if external={true}
        if (props.href && props.external) {
            const { href, target, rel, ...anchorProps } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={isDisabled ? undefined : props.href}
                    target={target ?? '_blank'}
                    rel={rel ?? 'noopener noreferrer'}
                    aria-disabled={isDisabled}
                    className={combinedClasses}
                    {...anchorProps}
                >
                    {content}
                </a>
            );
        }

        // Render as Inertia <Link> if href is provided
        if (props.href) {
            const linkProps = rest as InertiaLinkProps;
            return (
                <Link
                    ref={ref as any}
                    href={isDisabled ? '#' : props.href}
                    aria-disabled={isDisabled}
                    className={`${combinedClasses} ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
                    {...linkProps}
                >
                    {content}
                </Link>
            );
        }

        // Render as regular <button>
        const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                type={buttonProps.type ?? 'button'}
                disabled={isDisabled}
                className={combinedClasses}
                {...buttonProps}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
