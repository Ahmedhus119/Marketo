'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { Input } from './input';
import { validateEmail } from '@/lib/utils';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const validateForm = () => {
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return newErrors.email === '' && newErrors.password === '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Save to localStorage to simulate login
            localStorage.setItem('authToken', 'token_' + Math.random().toString(36).substr(2, 9));
            localStorage.setItem('userEmail', formData.email);

            alert('✅ Login successful!');
            router.push('/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900'>Welcome Back</h2>
                    <p className='text-gray-600 mt-2'>Sign in to your account</p>
                </div>

                {error && (
                    <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                        <p className='text-red-600 text-sm'>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        label='Email Address'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='your@email.com'
                        error={errors.email}
                        fullWidth
                    />

                    <Input
                        label='Password'
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='••••••••'
                        error={errors.password}
                        fullWidth
                    />

                    <div className='flex items-center justify-between text-sm'>
                        <label className='flex items-center gap-2'>
                            <input type='checkbox' className='rounded border-gray-300' />
                            <span className='text-gray-600'>Remember me</span>
                        </label>
                        <Link href='/forgot-password' className='text-blue-600 hover:text-blue-700'>
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type='submit'
                        variant='primary'
                        size='lg'
                        fullWidth
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-white text-gray-500'>Don't have an account?</span>
                        </div>
                    </div>

                    <Link href='/register' className='mt-4 block'>
                        <Button variant='secondary' size='lg' fullWidth>
                            Create Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}