import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import { Lora } from 'next/font/google';

import '@/app/globals.css';
import AbstractApp from '@/components/common/AbstractLayout';
import { GOOGLE_ANALYTICS, ROOT_URL } from '@/config/env';
import { cn } from '@/utils';
import { GoogleAnalytics } from '@next/third-parties/google';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { WebSite, WithContext } from 'schema-dts';

export const metadata: Metadata = {
    metadataBase: new URL(`${ROOT_URL}`),
    title: 'Nigerian Bank Logos',
    description: 'A curated collection of logos for Nigerian banks, fintechs, and NGX-listed companies.',
    icons: {
        icon: '/images/favicon.ico',
        shortcut: '/images/favicon-16x16.png',
        apple: '/images/apple-touch-icon.png'
    },
    keywords: [
        'Nigerian banks',
        'bank logos',
        'fintech logos',
        'NGX-listed companies',
        'Nigerian financial institutions',
        'Nigerian bank logos',
        'Nigerian fintech logos',
        'Nigerian stock exchange',
        'Nigerian financial logos',
        'Nigerian bank logo collection'
    ],
    twitter: {
        title: 'Nigerian Bank Logos',
        description: `A curated collection of logos for Nigerian banks, fintechs, and NGX-listed companies.`,
        images: [
            {
                url: '/images/og-image-md.jpg',
                width: 800,
                height: 600
            },
            {
                url: '/images/og-image-lg.jpg',
                width: 1800,
                height: 1600
            }
        ]
    },
    openGraph: {
        title: 'Nigerian Bank Logos',
        description: `A curated collection of logos for Nigerian banks, fintechs, and NGX-listed companies.`,
        url: `${ROOT_URL}`,
        siteName: 'Nigerian Bank Logos',
        images: [
            {
                url: '/images/og-image-md.jpg',
                width: 800,
                height: 600
            },
            {
                url: '/images/og-image-lg.jpg',
                width: 1800,
                height: 1600
            }
        ],
        locale: 'en_US',
        type: 'website'
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#121212' }
    ]
};

const lora = Lora({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-serif'
});

const schemaData: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nigerian Bank Logos',
    url: ROOT_URL,
    description: 'A curated collection of logos for Nigerian banks, fintechs, and NGX-listed companies.',
    publisher: {
        '@type': 'Organization',
        name: 'Nigerian Bank Logos',
        logo: `${ROOT_URL}/images/nbl-logo.png`
    },
    image: [`${ROOT_URL}/images/og-image-md.jpg`, `${ROOT_URL}/images/og-image-lg.jpg`],
    inLanguage: 'en'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <script
                    type='application/ld+json'
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaData)
                    }}
                />
            </head>
            <body
                className={cn(
                    `${GeistSans.variable} ${GeistMono.variable} ${lora.variable} font-sans`,
                    'overscroll-none whitespace-pre-line antialiased'
                )}
                suppressHydrationWarning>
                <AbstractApp>{children}</AbstractApp>
                <GoogleAnalytics gaId={`${GOOGLE_ANALYTICS}`} />
            </body>
        </html>
    );
}
