import MainLayout from '@/components/layout/MainLayout';
import Providers from '@/components/Providers';
import '@/app/globals.css';
import { Inter, Manrope } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata = {
  title: 'The Logistics Authority | Enterprise Portal',
  description: 'Precision Tectonics Gateway for LOGISTICS_NAM Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter bg-background text-on-background min-h-screen" suppressHydrationWarning>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
