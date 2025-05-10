
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

// Load IBM Plex Mono locally using relative paths
const ibmPlexMono = localFont({
  src: [
    {
      path: '../assets/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/IBM_Plex_Mono/IBMPlexMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/IBM_Plex_Mono/IBMPlexMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-mono',
  display: 'swap', // Improves font loading performance
});

export const metadata: Metadata = {
  title: 'HowToCook',
  description: 'Learn how to cook delicious recipes step by step.',
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
        <main className="flex-grow w-full">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}

