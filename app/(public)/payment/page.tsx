'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart';

interface PaymentFormData {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardholderName: string;
    country: string;
}

interface OrderData {
    items: any[];
    totalPrice: number;
    checkoutData: {
        city: string;
        details: string;
        phone: string;
    };
}

export default function PaymentPage() {
    const router = useRouter();
    const { clearCart } = useCart(); // Import clearCart from context
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dataError, setDataError] = useState(false);
    const [formData, setFormData] = useState<PaymentFormData>({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: '',
        country: 'Egypt',
    });

    const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

    // Load order data with multiple fallback strategies
    useEffect(() => {
        const loadOrderData = () => {
            console.log('Loading order data...');

            let data: OrderData | null = null;

            // Try 1: sessionStorage currentOrder (primary)
            try {
                const currentOrder = sessionStorage.getItem('currentOrder');
                if (currentOrder) {
                    console.log('Found data in sessionStorage.currentOrder');
                    data = JSON.parse(currentOrder);
                }
            } catch (e) {
                console.error('Failed to parse currentOrder:', e);
            }

            // Try 2: localStorage lastOrder (fallback)
            if (!data) {
                try {
                    const lastOrder = localStorage.getItem('lastOrder');
                    if (lastOrder) {
                        console.log('Found data in localStorage.lastOrder');
                        data = JSON.parse(lastOrder);
                    }
                } catch (e) {
                    console.error('Failed to parse lastOrder:', e);
                }
            }

            // Try 3: sessionStorage backup (additional fallback)
            if (!data) {
                try {
                    const backupOrder = sessionStorage.getItem('backupOrder');
                    if (backupOrder) {
                        console.log('Found data in sessionStorage.backupOrder');
                        data = JSON.parse(backupOrder);
                    }
                } catch (e) {
                    console.error('Failed to parse backupOrder:', e);
                }
            }

            if (data && data.items && data.items.length > 0) {
                console.log('Order data loaded successfully:', data);
                setOrderData(data);
                // Also save to backup
                sessionStorage.setItem('backupOrder', JSON.stringify(data));
                setDataError(false);
            } else {
                console.warn('No valid order data found');
                setDataError(true);
            }

            setIsLoading(false);
        };

        // Delay slightly to ensure data is written
        const timer = setTimeout(loadOrderData, 300);
        return () => clearTimeout(timer);
    }, []);

    const validateForm = () => {
        const newErrors: Partial<PaymentFormData> = {};

        if (!formData.cardNumber || formData.cardNumber.length < 13) {
            newErrors.cardNumber = 'Invalid card number';
        }

        if (!formData.expiryDate || formData.expiryDate.length < 5) {
            newErrors.expiryDate = 'Invalid expiry date';
        }

        if (!formData.cvc || formData.cvc.length < 3) {
            newErrors.cvc = 'Invalid CVC';
        }

        if (!formData.cardholderName) {
            newErrors.cardholderName = 'Cardholder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setFormData(prev => ({ ...prev, [name]: formatted }));
        }
        // Format expiry date
        else if (name === 'expiryDate') {
            const formatted = value.replace(/\D/g, '');
            if (formatted.length >= 2) {
                setFormData(prev => ({
                    ...prev,
                    [name]: `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`,
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: formatted }));
            }
        }
        // Only numbers for CVC
        else if (name === 'cvc') {
            const formatted = value.replace(/\D/g, '').slice(0, 4);
            setFormData(prev => ({ ...prev, [name]: formatted }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for this field
        if (errors[name as keyof PaymentFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !orderData) {
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Save successful payment
            sessionStorage.setItem('lastSuccessfulOrder', JSON.stringify({
                ...orderData,
                paymentDate: new Date().toISOString(),
                paymentMethod: 'Card',
                cardLast4: formData.cardNumber.slice(-4),
            }));

            // ✅ CLEAR THE CART AFTER SUCCESSFUL PAYMENT
            clearCart();
            console.log('Cart cleared after successful payment');

            // Clear the current order data
            sessionStorage.removeItem('currentOrder');
            localStorage.removeItem('lastOrder');
            sessionStorage.removeItem('backupOrder');

            // Simulate payment success
            setPaymentSuccess(true);

            // Redirect to home after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600 font-medium'>Loading payment...</p>
                </div>
            </div>
        );
    }

    if (dataError || !orderData) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
                <div className='max-w-md w-full text-center'>
                    <svg className='w-20 h-20 mx-auto text-red-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <h1 className='text-2xl font-bold text-gray-900 mb-2'>No Order Found</h1>
                    <p className='text-gray-600 mb-6'>
                        We couldn't load your order. Please go back and try again.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition'
                    >
                        Go Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4'>
                <div className='max-w-md w-full text-center'>
                    <div className='mb-8'>
                        <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-10 h-10 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                            </svg>
                        </div>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            Payment Successful!
                        </h1>
                        <p className='text-gray-600'>
                            Your order has been confirmed and will be shipped soon.
                        </p>
                    </div>

                    <div className='bg-white rounded-lg shadow p-6 mb-8 border border-gray-100'>
                        <p className='text-gray-600 mb-2'>Order Amount</p>
                        <p className='text-3xl font-bold text-gray-900'>
                            EGP {orderData?.totalPrice.toFixed(2) || '0.00'}
                        </p>
                    </div>

                    {orderData && (
                        <div className='bg-gray-50 rounded-lg p-4 mb-8 text-left text-sm'>
                            <h3 className='font-bold text-gray-900 mb-3'>Shipping Address</h3>
                            <p className='text-gray-600 mb-1'>{orderData.checkoutData.city}</p>
                            <p className='text-gray-600 mb-3'>{orderData.checkoutData.details}</p>
                            <p className='font-medium text-gray-900'>{orderData.checkoutData.phone}</p>
                        </div>
                    )}

                    <p className='text-sm text-gray-500 mb-4'>
                        Redirecting to home page...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4'>
            <div className='max-w-3xl mx-auto'>
                {/* Header */}
                <div className='mb-12'>
                    <div className='flex items-center justify-between mb-8'>
                        <button
                            onClick={() => router.back()}
                            className='text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2'
                        >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                            </svg>
                            Back
                        </button>
                        <h1 className='text-4xl font-bold text-gray-900'>Checkout</h1>
                        <div className='w-16'></div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12'>
                    <form onSubmit={handlePayment}>
                        <h2 className='text-2xl font-bold text-gray-900 mb-8'>Payment Method</h2>

                        {/* Card Display */}
                        <div className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-12 h-56 flex flex-col justify-between shadow-lg'>
                            <div>
                                <p className='text-sm opacity-75 font-medium'>Card Number</p>
                                <p className='text-3xl tracking-widest font-mono mt-2'>
                                    {formData.cardNumber || '•••• •••• •••• ••••'}
                                </p>
                            </div>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <p className='text-xs opacity-75 font-medium'>Card Holder</p>
                                    <p className='font-semibold text-lg mt-1'>
                                        {formData.cardholderName || 'FULL NAME'}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-xs opacity-75 font-medium'>Expires</p>
                                    <p className='font-semibold text-lg mt-1'>
                                        {formData.expiryDate || 'MM / YY'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className='space-y-6 mb-8'>
                            {/* Card Number */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                                    Card Number
                                </label>
                                <input
                                    type='text'
                                    name='cardNumber'
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    placeholder='1234 1234 1234 1234'
                                    maxLength={19}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${errors.cardNumber
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                />
                                {errors.cardNumber && (
                                    <p className='text-red-600 text-sm mt-2'>
                                        {errors.cardNumber}
                                    </p>
                                )}
                            </div>

                            {/* Expiry and CVC */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                                        Expiry Date
                                    </label>
                                    <input
                                        type='text'
                                        name='expiryDate'
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        placeholder='MM / YY'
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${errors.expiryDate
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.expiryDate && (
                                        <p className='text-red-600 text-sm mt-2'>
                                            {errors.expiryDate}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 mb-2'>
                                        CVC
                                    </label>
                                    <input
                                        type='text'
                                        name='cvc'
                                        value={formData.cvc}
                                        onChange={handleChange}
                                        placeholder='123'
                                        maxLength={4}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${errors.cvc ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.cvc && (
                                        <p className='text-red-600 text-sm mt-2'>
                                            {errors.cvc}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                                    Cardholder Name
                                </label>
                                <input
                                    type='text'
                                    name='cardholderName'
                                    value={formData.cardholderName}
                                    onChange={handleChange}
                                    placeholder='Full name on card'
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 ${errors.cardholderName
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                />
                                {errors.cardholderName && (
                                    <p className='text-red-600 text-sm mt-2'>
                                        {errors.cardholderName}
                                    </p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                                    Country or Region
                                </label>
                                <select
                                    name='country'
                                    value={formData.country}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900'
                                >
                                    <option>Egypt</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Saudi Arabia</option>
                                    <option>UAE</option>
                                </select>
                            </div>

                            {/* Checkbox */}
                            <label className='flex items-center gap-2 pt-2'>
                                <input type='checkbox' className='w-4 h-4 rounded' />
                                <span className='text-sm text-gray-600'>
                                    Save my information for faster checkout
                                </span>
                            </label>
                        </div>

                        {/* Order Total Info */}
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-700 font-medium'>Order Total:</span>
                                <span className='text-2xl font-bold text-blue-600'>
                                    EGP {orderData?.totalPrice.toFixed(2) || '0.00'}
                                </span>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            type='submit'
                            disabled={isProcessing}
                            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg'
                        >
                            {isProcessing ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                                    Processing Payment...
                                </span>
                            ) : (
                                `Pay EGP ${orderData?.totalPrice.toFixed(2) || '0.00'}`
                            )}
                        </button>

                        {/* Security Info */}
                        <div className='mt-8 pt-8 border-t border-gray-200 text-center'>
                            <p className='text-sm text-gray-500 flex items-center justify-center gap-2'>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                                </svg>
                                Your payment is secure and encrypted
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}