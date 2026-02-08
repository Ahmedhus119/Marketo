'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Input } from './input';
import { validateEmail, validatePassword, validatePhone } from '@/lib/utils';

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
    });

    const validateForm = () => {
        const newErrors = { name: '', email: '', phone: '', password: '', passwordConfirm: '' };

        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.feedback[0] || 'Password too weak';
            }
        }

        if (!formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Please confirm your password';
        } else if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(e => e === '');
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
            alert('Registration functionality coming soon!\nName: ' + formData.name + '\nEmail: ' + formData.email);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900'>Create Account</h2>
                    <p className='text-gray-600 mt-2'>Join us today and start shopping</p>
                </div>

                {error && (
                    <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                        <p className='text-red-600 text-sm'>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        label='Full Name'
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='John Doe'
                        error={errors.name}
                        fullWidth
                    />

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
                        label='Phone Number (Optional)'
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='+1234567890'
                        error={errors.phone}
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

                    <Input
                        label='Confirm Password'
                        type='password'
                        name='passwordConfirm'
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        placeholder='••••••••'
                        error={errors.passwordConfirm}
                        fullWidth
                    />

                    <Button
                        type='submit'
                        variant='primary'
                        size='lg'
                        fullWidth
                        isLoading={isLoading}
                    >
                        Create Account
                    </Button>
                </form>

                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-white text-gray-500'>Already have an account?</span>
                        </div>
                    </div>

                    <Link href='/login' className='mt-4 block'>
                        <Button variant='secondary' size='lg' fullWidth>
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}