import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RideShareX - Smart Ride Sharing Platform',
  description: 'Connect, Share, and Travel with RideShareX - The smart way to share rides',
  keywords: ['rideshare', 'transportation', 'carpool', 'travel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}