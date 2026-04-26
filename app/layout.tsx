import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'ANFAAL | Premium Mens Wear',
  description: 'Redefine your streetwear. Premium mens tracksuits, hoodies, and t-shirts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${bebas.variable}`}>
      <body className="bg-black text-white font-body selection:bg-crimson selection:text-white" suppressHydrationWarning>
        <Providers>
          <LoadingScreen />
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen pt-[30px] md:pt-[40px]">{children}</main>
          <WhatsAppButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
