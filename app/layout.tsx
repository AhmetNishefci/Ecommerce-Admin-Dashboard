import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import { ModalProvider } from '@/providers/modalProvider'
import { ToastProvider } from '@/providers/toastProvider'
import { ThemeProvider } from '@/providers/themeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider/>
        <ModalProvider/>
            {children}
        </ThemeProvider>
      </body>
    </html>
  </ClerkProvider>
  )
}

export default RootLayout
