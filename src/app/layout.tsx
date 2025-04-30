import type { Metadata } from 'next';
import { Roboto } from 'next/font/google'; // Changed from Geist to Roboto
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const roboto = Roboto({ // Use Roboto
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Include desired weights
  variable: '--font-sans', // Assign to a CSS variable
});

export const metadata: Metadata = {
  title: 'Expense Tracker Lite', // Updated title
  description: 'Track your expenses easily.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased', // Use the font variable
          roboto.variable // Apply the font variable class
        )}
      >
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
