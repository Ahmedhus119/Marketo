'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
}

const categoryIcons: { [key: string]: string } = {
    'electronics': '📱',
    'fashion': '👗',
    'home': '🏠',
    'sports': '⚽',
    'beauty': '💄',
    'books': '📚',
    'toys': '🎮',
    'food': '🍔',
    'garden': '🌱',
    'furniture': '🛋️',
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    'https://ecommerce.routemisr.com/api/v1/categories'
                );
                const data = await response.json();
                setCategories(data.data || []);
            } catch (err) {
                setError('Failed to fetch categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getCategoryIcon = (name: string): string => {
        const key = name.toLowerCase().replace(/\s+/g, '-');
        return categoryIcons[key] || '🏪';
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
            <div className='max-w-7xl mx-auto px-4 py-16'>
                {/* Header */}
                <div className='mb-16'>
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-2'>
                        Shop by Category
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        Browse our wide range of products by category
                    </p>
                </div>

                {error && (
                    <div className='mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
                        <svg className='w-5 h-5 text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                        </svg>
                        <p className='text-red-600 font-medium'>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className='flex items-center justify-center min-h-96'>
                        <div className='space-y-4 text-center'>
                            <div className='inline-flex'>
                                <div className='w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
                            </div>
                            <p className='text-gray-600 font-medium'>Loading categories...</p>
                        </div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className='text-center py-16'>
                        <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                        </svg>
                        <p className='text-gray-600 text-lg'>No categories found</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                href={`/products?category=${category._id}`}
                            >
                                <div className='bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer h-full'>
                                    {/* Image or Icon Background */}
                                    <div className='relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden flex items-center justify-center'>
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                            />
                                        ) : (
                                            <span className='text-7xl group-hover:scale-125 transition-transform duration-300'>
                                                {getCategoryIcon(category.name)}
                                            </span>
                                        )}
                                        <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                                    </div>

                                    {/* Content */}
                                    <div className='p-6 text-center'>
                                        <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition'>
                                            {category.name}
                                        </h3>
                                        <p className='text-blue-600 font-semibold flex items-center justify-center gap-2 group-hover:gap-3 transition'>
                                            Shop Now
                                            <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                            </svg>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}