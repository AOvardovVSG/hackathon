'use client'

import { usePathname } from 'next/navigation'

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <main className={`${isHomePage ? 'w-full' : 'mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8 py-6'}`}>
      {children}
    </main>
  )
}
