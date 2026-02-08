'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/button';
import { useCart } from '@/context/cart';
import { Input } from '@/components/input';

interface CheckoutData {
    city: string;
    details: string;
    phone: string;
}

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const router = useRouter();
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState<CheckoutData>({
        city: '',
        details: '',
        phone: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity > 0) {
            updateQuantity(productId, quantity);
        }
    };

    const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckout = async () => {
        if (!checkoutData.city || !checkoutData.details || !checkoutData.phone) {
            alert('Please fill in all fields');
            return;
        }

        setIsProcessing(true);
        try {
            // Prepare complete order data
            const orderData = {
                checkoutData,
                items: items.map(item => ({
                    _id: item._id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    imageCover: item.imageCover,
                })),
                totalPrice: totalPrice,
                totalItems: totalItems,
                timestamp: new Date().toISOString(),
                sessionId: sessionStorage.getItem('sessionId'),
            };

            console.log('Saving order data:', orderData);

            // Save to BOTH sessionStorage and localStorage with multiple keys for redundancy
            sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
            sessionStorage.setItem('backupOrder', JSON.stringify(orderData));
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
            localStorage.setItem('cart_backup_final', JSON.stringify(orderData));

            // Wait a moment to ensure data is written
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify data was saved
            const verifySession = sessionStorage.getItem('currentOrder');
            const verifyLocal = localStorage.getItem('lastOrder');

            if (!verifySession || !verifyLocal) {
                console.error('Failed to verify saved data');
                alert('Failed to save order. Please try again.');
                setIsProcessing(false);
                return;
            }

            console.log('Order data verified and saved successfully');

            // Redirect to payment page
            router.push('/payment');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to proceed to checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && !showCheckout) {
        return (
            <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4'>
                <div className='text-center max-w-md'>
                    <svg className='w-20 h-20 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Your Cart is Empty</h1>
                    <p className='text-gray-600 mb-8'>Start shopping to add items to your cart</p>
                    <Link href='/products'>
                        <Button variant='primary' size='lg' fullWidth>
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-12'>
            <div className='max-w-7xl mx-auto px-4'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>Shopping Cart</h1>
                    <p className='text-gray-600'>
                        {items.length} item{items.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Cart Items */}
                    <div className='lg:col-span-2'>
                        <div className='space-y-4'>
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className='bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-4 flex gap-4'
                                >
                                    {/* Image */}
                                    <div className='w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                                        <img
                                            src={item.imageCover}
                                            alt={item.title}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-900 line-clamp-2 mb-1'>
                                            {item.title}
                                        </h3>
                                        <p className='text-gray-600 text-sm mb-3'>
                                            EGP {item.price.toFixed(2)} each
                                        </p>

                                        {/* Quantity Control */}
                                        <div className='flex items-center gap-2 bg-gray-50 rounded-lg w-fit p-1'>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item._id, item.quantity - 1)
                                                }
                                                className='w-8 h-8 rounded flex items-center justify-center hover:bg-gray-200 transition text-gray-700'
                                                aria-label='Decrease quantity'
                                            >
                                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                    <path fillRule='evenodd' d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
                                                </svg>
                                            </button>
                                            <span className='w-8 text-center font-semibold text-gray-900'>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item._id, item.quantity + 1)
                                                }
                                                className='w-8 h-8 rounded flex items-center justify-center hover:bg-gray-200 transition text-gray-700'
                                                aria-label='Increase quantity'
                                            >
                                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                    <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className='text-right flex flex-col justify-between'>
                                        <p className='font-bold text-lg text-gray-900'>
                                            EGP {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className='text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 justify-end hover:bg-red-50 px-2 py-1 rounded transition'
                                        >
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit sticky top-4'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Order Summary</h2>

                        {/* Items List */}
                        <div className='space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto'>
                            {items.map((item) => (
                                <div key={item._id} className='flex justify-between text-sm'>
                                    <span className='text-gray-600 truncate pr-2'>
                                        {item.title.substring(0, 30)}... × {item.quantity}
                                    </span>
                                    <span className='font-medium text-gray-900 flex-shrink-0'>
                                        EGP {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className='space-y-3 mb-6'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Subtotal ({items.length} items)</span>
                                <span className='font-medium'>EGP {totalPrice.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Shipping</span>
                                <span className='font-medium text-green-600'>Free</span>
                            </div>
                        </div>

                        <div className='border-t border-gray-200 pt-4 mb-6'>
                            <div className='flex justify-between items-center text-xl font-bold text-gray-900'>
                                <span>Total</span>
                                <span className='text-2xl'>EGP {totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {!showCheckout ? (
                            <>
                                <Button
                                    variant='primary'
                                    size='lg'
                                    fullWidth
                                    onClick={() => setShowCheckout(true)}
                                    className='mb-3'
                                >
                                    Proceed to Checkout
                                </Button>
                                <Link href='/products' className='block'>
                                    <Button variant='secondary' size='lg' fullWidth>
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <h3 className='text-lg font-bold text-gray-900 mb-4'>Shipping Address</h3>
                                <div className='space-y-4 mb-6'>
                                    <Input
                                        label='City'
                                        type='text'
                                        name='city'
                                        value={checkoutData.city}
                                        onChange={handleCheckoutChange}
                                        placeholder='Cairo'
                                        fullWidth
                                    />
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Address Details
                                        </label>
                                        <textarea
                                            name='details'
                                            value={checkoutData.details}
                                            onChange={handleCheckoutChange}
                                            placeholder='Street address, apartment, etc.'
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                                            rows={3}
                                        />
                                    </div>
                                    <Input
                                        label='Phone Number'
                                        type='tel'
                                        name='phone'
                                        value={checkoutData.phone}
                                        onChange={handleCheckoutChange}
                                        placeholder='01001234567'
                                        fullWidth
                                    />
                                </div>

                                <Button
                                    variant='primary'
                                    size='lg'
                                    fullWidth
                                    onClick={handleCheckout}
                                    isLoading={isProcessing}
                                    className='mb-3'
                                >
                                    Continue to Payment
                                </Button>
                                <Button
                                    variant='secondary'
                                    size='lg'
                                    fullWidth
                                    onClick={() => setShowCheckout(false)}
                                >
                                    Back
                                </Button>
                            </>
                        )}

                        {/* Security Info */}
                        <div className='mt-6 pt-6 border-t border-gray-200 text-center'>
                            <p className='text-xs text-gray-500 flex items-center justify-center gap-1'>
                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                                </svg>
                                Your payment is secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}