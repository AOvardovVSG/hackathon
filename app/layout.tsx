import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HR Portal',
  description: 'HR Management System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navigation />
          <main className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
