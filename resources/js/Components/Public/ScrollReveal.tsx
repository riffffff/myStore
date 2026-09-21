import React, { useEffect, useRef, useState, memo } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number; // Delay in milliseconds
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * Scroll reveal animation component - memoized to prevent unnecessary re-renders
 */
const ScrollReveal = memo(function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
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
    }, []);

    const getDirectionClass = () => {
        switch (direction) {
            case 'up':
                return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0';
            case 'down':
                return isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0';
            case 'left':
                return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0';
            case 'right':
                return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0';
            case 'none':
                return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
            default:
                return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0';
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
