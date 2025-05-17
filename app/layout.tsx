import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import MainContent from './components/MainContent'

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
          <MainContent>{children}</MainContent>
        </body>
      </html>
    </ClerkProvider>
  )
}
