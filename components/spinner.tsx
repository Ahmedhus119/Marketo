'use client';

import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'white' | 'gray';
    fullScreen?: boolean;
}

export function Spinner({ size = 'md', color = 'blue', fullScreen = false }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const colorClasses = {
        blue: 'border-blue-600 border-t-blue-400',
        white: 'border-white border-t-gray-200',
        gray: 'border-gray-600 border-t-gray-300',
    };

    const spinnerContent = (
        <div className={`${sizeClasses[size]} border-4 border-t-2 rounded-full animate-spin ${colorClasses[color]}`} />
    );

    if (fullScreen) {
        return (
            <div className='fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50'>
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
}