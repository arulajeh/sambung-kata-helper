import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sambung Kata Helper',
  description: 'Helper tool for Indonesian word-chain games (sambung kata)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  )
}
