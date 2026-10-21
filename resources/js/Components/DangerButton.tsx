import React from 'react';
import Button, { ButtonProps } from '@/Components/Button';

export type DangerButtonProps = ButtonProps;

export default function DangerButton({
    className = '',
    children,
    ...props
}: DangerButtonProps) {
    return (
        <Button
            variant="danger"
            size="md"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}
