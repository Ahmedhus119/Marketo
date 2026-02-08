import Link from 'next/link';
import { Button } from '@/components/button';

export const metadata = {
    title: 'Home - Ecommerce',
    description: 'Welcome to Marketo',
};

export default function HomePage() {
    return (
        <div className='min-h-screen'>
            {/* Hero Section */}
            <section className='bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4'>
                <div className='max-w-7xl mx-auto text-center'>
                    <h1 className='text-5xl font-bold mb-6'>Welcome to Marketo</h1>
                    <p className='text-xl mb-8 text-blue-100'>
                        Discover amazing products at unbeatable prices
                    </p>
                    <Link href='/products'>
                        <Button variant='secondary' size='lg'>
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className='py-16 px-4 bg-gray-50'>
                <div className='max-w-7xl mx-auto'>
                    <h2 className='text-3xl font-bold text-center mb-12'>Why Choose Us</h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        <div className='bg-white p-8 rounded-lg shadow-md text-center'>
                            <div className='text-4xl mb-4'>🚚</div>
                            <h3 className='text-xl font-semibold mb-2'>Fast Shipping</h3>
                            <p className='text-gray-600'>
                                Free shipping on orders over $50. Quick delivery to your doorstep.
                            </p>
                        </div>
                        <div className='bg-white p-8 rounded-lg shadow-md text-center'>
                            <div className='text-4xl mb-4'>🔒</div>
                            <h3 className='text-xl font-semibold mb-2'>Secure Payment</h3>
                            <p className='text-gray-600'>
                                Your payment information is encrypted and secure with us.
                            </p>
                        </div>
                        <div className='bg-white p-8 rounded-lg shadow-md text-center'>
                            <div className='text-4xl mb-4'>💯</div>
                            <h3 className='text-xl font-semibold mb-2'>Quality Guaranteed</h3>
                            <p className='text-gray-600'>
                                All products are verified for quality. 100% satisfaction guaranteed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className='py-16 px-4'>
                <div className='max-w-7xl mx-auto'>
                    <h2 className='text-3xl font-bold text-center mb-12'>Shop by Category</h2>
                    <div className='grid md:grid-cols-4 gap-6'>
                        {[
                            { name: 'Electronics', emoji: '📱' },
                            { name: 'Fashion', emoji: '👗' },
                            { name: 'Home & Garden', emoji: '🏠' },
                            { name: 'Sports', emoji: '⚽' },
                        ].map(category => (
                            <Link key={category.name} href={`/products?category=${category.name}`}>
                                <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg hover:shadow-lg transition cursor-pointer text-center'>
                                    <div className='text-5xl mb-4'>{category.emoji}</div>
                                    <h3 className='text-xl font-semibold'>{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='bg-blue-600 text-white py-16 px-4'>
                <div className='max-w-7xl mx-auto text-center'>
                    <h2 className='text-3xl font-bold mb-4'>Ready to Start Shopping?</h2>
                    <p className='text-blue-100 mb-8 text-lg'>
                        Browse our collection of thousands of products
                    </p>
                    <div className='flex gap-4 justify-center flex-wrap'>
                        <Link href='/products'>
                            <Button variant='secondary' size='lg'>
                                Browse Products
                            </Button>
                        </Link>
                        <Link href='/categories'>
                            <Button variant='secondary' size='lg'>
                                View Categories
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}