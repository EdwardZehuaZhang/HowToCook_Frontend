
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

// Load IBM Plex Mono locally
const ibmPlexMono = localFont({
  src: [
    {
      path: '../assets/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/IBM_Plex_Mono/IBMPlexMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HowToCook',
  description: 'Discover and generate delicious recipes with AI-powered assistance',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HowToCook',
  },
  themeColor: '#f97316',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          ibmPlexMono.variable,
          'min-h-screen bg-background text-foreground font-sans antialiased flex flex-col'
        )}
      >
        {/* Removed Header and Footer for mobile app focus */}
        <main className="flex-grow w-full">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
