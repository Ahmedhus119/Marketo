'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export function Input({
    label,
    error,
    helperText,
    icon,
    fullWidth = false,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const containerClass = fullWidth ? 'w-full' : '';

    const inputClass = `
    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
    ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
    ${icon ? 'pl-10' : ''}
    ${className}
  `.trim();

    return (
        <div className={containerClass}>
            {label && (
                <label htmlFor={inputId} className='block text-sm font-medium text-gray-700 mb-1'>
                    {label}
                </label>
            )}

            <div className='relative'>
                {icon && (
                    <div className='absolute left-3 top-2.5 text-gray-400'>
                        {icon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={inputClass}
                    {...props}
                />
            </div>

            {error && (
                <p className='text-red-600 text-sm mt-1'>{error}</p>
            )}

            {helperText && !error && (
                <p className='text-gray-500 text-sm mt-1'>{helperText}</p>
            )}
        </div>
    );
}