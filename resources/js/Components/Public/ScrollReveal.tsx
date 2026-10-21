import React, { useEffect, useRef, useState, memo } from 'react';
import { isCurrentPageFirstVisit } from '@/lib/navigation';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number; // Delay in milliseconds
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * Scroll reveal animation component.
 * Animates ONLY when the current page is visited for the FIRST time in this session (or after refresh).
 * If the user revisits a page they have already opened previously, it renders immediately without transition.
 */
const ScrollReveal = memo(function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: ScrollRevealProps) {
    const isFirstVisit = isCurrentPageFirstVisit();
    const [isVisible, setIsVisible] = useState(!isFirstVisit);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // If this page was already visited previously, content stays visible without observing
        if (!isFirstVisit) {
            setIsVisible(true);
            return;
        }

        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold: 0.02,
                rootMargin: '50px 0px 50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [isFirstVisit]);

    // On revisited pages, render immediately with zero animation delay or transform
    if (!isFirstVisit) {
        return <div className={className}>{children}</div>;
    }

    const getDirectionClass = () => {
        switch (direction) {
            case 'up':
                return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0';
            case 'down':
                return isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0';
            case 'left':
                return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0';
            case 'right':
                return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0';
            case 'none':
                return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
            default:
                return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out transform ${getDirectionClass()} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
});

export default ScrollReveal;
