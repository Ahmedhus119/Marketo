import type { Metadata } from 'next';
import { CartProvider } from '@/context/cart';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
    title: 'ShopHub - Your Premium Shopping Destination',
    description: 'Discover the best products with fast shipping, secure payments, and excellent customer service.',
    icons: {
        icon: [
            {
                url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%232563eb" width="180" height="180" rx="40"/><path fill="white" d="M50 60h80v15H50zm-5 20h90v60H45zm10 10h70v40H55z"/><circle cx="135" cy="125" r="8" fill="%232563eb"/><circle cx="75" cy="125" r="8" fill="%232563eb"/></svg>',
                type: 'image/svg+xml',
            },
        ],
    },
    applicationName: 'ShopHub',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'ShopHub',
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <meta name="theme-color" content="#2563eb" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            </head>
            <body className='bg-white text-gray-900' suppressHydrationWarning>
                <CartProvider>
                    <Navbar />
                    <main className='min-h-screen'>
                        {children}
                    </main>
                    <Footer />
                </CartProvider>
            </body>
        </html>
    );
}