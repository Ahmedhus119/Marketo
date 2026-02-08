'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';

    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:bg-blue-400',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-95 disabled:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 disabled:bg-red-400',
        success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95 disabled:bg-green-400',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`.trim();

    return (
        <button
            className={finalClassName}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className='inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin'></span>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}