import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Added 500 for medium if needed, 700 for bold
});

// General metadata for the app
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
          ibmPlexMono.variable, // Apply the font variable here
          'min-h-screen bg-background text-foreground font-sans antialiased flex flex-col'
        )}
      >
        {/* Removed Header */}
        <main className="flex-grow w-full"> {/* Adjusted to w-full, page.tsx will handle its own centering and max-width */}
          {children}
        </main>
        {/* Removed Footer */}
        <Toaster />
      </body>
    </html>
  );
}
