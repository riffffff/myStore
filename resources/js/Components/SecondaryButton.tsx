import React from 'react';
import Button, { ButtonProps } from '@/Components/Button';

export type SecondaryButtonProps = ButtonProps;

export default function SecondaryButton({
    className = '',
    children,
    ...props
}: SecondaryButtonProps) {
    return (
        <Button
            variant="outline"
            size="md"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}
