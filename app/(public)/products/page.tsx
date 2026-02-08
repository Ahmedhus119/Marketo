'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/button';
import { useCart } from '@/context/cart';

interface Product {
    _id: string;
    title: string;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    ratingsAverage: number;
    category?: { name: string; _id: string };
}

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}

function ProductsContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('category');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'https://ecommerce.routemisr.com/api/v1/products';

                if (categoryId) {
                    url = `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                setProducts(data.data || []);
                setError('');
            } catch (err) {
                setError('Failed to fetch products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now().toString();
        const toast = { id, message, type };
        setToasts(prev => [...prev, toast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const handleAddToCart = (product: Product) => {
        // Check if user is logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        if (!token) {
            addToast('Please login to add items to cart', 'error');
            router.push('/login');
            return;
        }

        addToCart(product);
        addToast(`✓ ${product.title} added to cart!`, 'success');
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
            {/* Toast Notifications */}
            <div className='fixed top-20 right-4 z-50 space-y-2'>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${toast.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                            </svg>
                        ) : (
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                            </svg>
                        )}
                        <span className='font-medium text-sm'>{toast.message}</span>
                    </div>
                ))}
            </div>

            <div className='max-w-7xl mx-auto px-4 py-16'>
                {/* Header */}
                <div className='mb-12'>
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-2'>
                        {categoryId ? 'Category Products' : 'All Products'}
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        {categoryId ? 'Handpicked items from your selected category' : 'Explore our premium collection'}
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
                            <p className='text-gray-600 font-medium'>Loading products...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className='text-center py-16'>
                        <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                        </svg>
                        <p className='text-gray-600 text-lg'>No products found in this category</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {products.slice(0, 20).map((product) => (
                            <div
                                key={product._id}
                                className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100'
                            >
                                {/* Image */}
                                <div className='aspect-square bg-gray-100 overflow-hidden relative'>
                                    <img
                                        src={product.imageCover}
                                        alt={product.title}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                    />
                                    {product.priceAfterDiscount && (
                                        <div className='absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
                                            Sale
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className='p-4'>
                                    <h3 className='font-semibold text-gray-900 line-clamp-2 mb-2 text-sm group-hover:text-blue-600 transition'>
                                        {product.title}
                                    </h3>

                                    {/* Rating */}
                                    <div className='flex items-center gap-2 mb-3'>
                                        <div className='flex items-center'>
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.round(product.ratingsAverage)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                    fill='currentColor'
                                                    viewBox='0 0 20 20'
                                                >
                                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className='text-xs text-gray-600'>
                                            ({product.ratingsAverage?.toFixed(1) || 'N/A'})
                                        </span>
                                    </div>

                                    {/* Category */}
                                    {product.category && (
                                        <p className='text-xs text-gray-500 mb-3 capitalize'>
                                            {product.category.name}
                                        </p>
                                    )}

                                    {/* Price */}
                                    <div className='mb-4'>
                                        {product.priceAfterDiscount ? (
                                            <div className='flex items-center gap-2'>
                                                <p className='text-sm text-gray-400 line-through'>
                                                    EGP {product.price}
                                                </p>
                                                <p className='text-lg font-bold text-red-600'>
                                                    EGP {product.priceAfterDiscount}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className='text-lg font-bold text-gray-900'>
                                                EGP {product.price}
                                            </p>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm'
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                        </svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading products...</p>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}