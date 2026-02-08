'use client';

import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-gray-900 text-gray-200 mt-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                    {/* About */}
                    <div>
                        <h3 className='text-white font-bold text-lg mb-4'>Ecommerce</h3>
                        <p className='text-sm text-gray-400'>
                            Your one-stop shop for quality products at great prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-white font-semibold mb-4'>Quick Links</h4>
                        <ul className='space-y-2 text-sm'>
                            <li>
                                <Link href='/' className='text-gray-400 hover:text-white transition'>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href='/products' className='text-gray-400 hover:text-white transition'>
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href='/categories' className='text-gray-400 hover:text-white transition'>
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href='/brands' className='text-gray-400 hover:text-white transition'>
                                    Brands
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className='text-white font-semibold mb-4'>Customer Service</h4>
                        <ul className='space-y-2 text-sm'>
                            <li>
                                <Link href='/contact' className='text-gray-400 hover:text-white transition'>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href='/faq' className='text-gray-400 hover:text-white transition'>
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href='/returns' className='text-gray-400 hover:text-white transition'>
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href='/shipping' className='text-gray-400 hover:text-white transition'>
                                    Shipping Info
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className='text-white font-semibold mb-4'>Legal</h4>
                        <ul className='space-y-2 text-sm'>
                            <li>
                                <Link href='/privacy' className='text-gray-400 hover:text-white transition'>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href='/terms' className='text-gray-400 hover:text-white transition'>
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href='/cookies' className='text-gray-400 hover:text-white transition'>
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className='border-gray-700 mb-8' />

                {/* Bottom */}
                <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
                    <p>&copy; {currentYear} Ecommerce. All rights reserved.</p>
                    <div className='flex gap-4 mt-4 md:mt-0'>
                        <a href='#' className='hover:text-white transition'>
                            Facebook
                        </a>
                        <a href='#' className='hover:text-white transition'>
                            Twitter
                        </a>
                        <a href='#' className='hover:text-white transition'>
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}