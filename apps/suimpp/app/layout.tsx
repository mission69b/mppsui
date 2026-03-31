import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'suimpp — Machine Payments on Sui',
  description:
    'The open protocol for AI agents to pay for APIs with USDC on Sui. Browse servers, explore payments, build integrations.',
  metadataBase: new URL('https://suimpp.dev'),
  openGraph: {
    title: 'suimpp — Machine Payments on Sui',
    description:
      'The open protocol for AI agents to pay for APIs with USDC on Sui.',
    url: 'https://suimpp.dev',
    siteName: 'suimpp',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'suimpp — Machine Payments on Sui',
    description:
      'The open protocol for AI agents to pay for APIs with USDC on Sui.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
