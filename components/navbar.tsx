'use client';

import Link from 'next/link';
import { Button } from './button';
import { useCart } from '@/context/cart';

export function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className='bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center gap-3 group'>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105'>
                            <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.992-1.243l-1.5-6A1 1 0 0013 1H4.236A1 1 0 003.772 2.5H3zm9 5a2 2 0 11-4 0 2 2 0 014 0z' />
                            </svg>
                        </div>
                        <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'>Marketo</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className='hidden md:flex items-center gap-8'>
                        <Link href='/' className='text-gray-700 hover:text-blue-600 transition font-medium text-sm'>
                            Home
                        </Link>
                        <Link href='/products' className='text-gray-700 hover:text-blue-600 transition font-medium text-sm'>
                            Products
                        </Link>
                        <Link href='/categories' className='text-gray-700 hover:text-blue-600 transition font-medium text-sm'>
                            Categories
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className='flex items-center gap-4'>
                        {/* Cart Icon with Badge */}
                        <Link href='/cart' className='relative group'>
                            <button className='relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 rounded-lg'>
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                                </svg>
                                {totalItems > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse'>
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </Link>

                        {/* Auth Buttons */}
                        <Link href='/login'>
                            <Button variant='secondary' size='sm'>
                                Sign In
                            </Button>
                        </Link>
                        <Link href='/register' className='hidden sm:block'>
                            <Button variant='primary' size='sm'>
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}