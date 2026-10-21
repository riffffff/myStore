import React from 'react';
import Button, { ButtonProps } from '@/Components/Button';

export type PrimaryButtonProps = ButtonProps;

export default function PrimaryButton({
    className = '',
    children,
    ...props
}: PrimaryButtonProps) {
    return (
        <Button
            variant="primary"
            size="md"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}
