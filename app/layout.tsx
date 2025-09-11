import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'LLMs for Everyone - Interactive Presentation',
  description: 'Demystifying Neural Networks and Large Language Models through interactive visualizations and clear explanations.',
  keywords: ['AI', 'Machine Learning', 'Neural Networks', 'LLMs', 'Education', 'Presentation'],
  authors: [{ name: 'LLMs for Everyone' }],
  openGraph: {
    title: 'LLMs for Everyone',
    description: 'Interactive presentation demystifying Neural Networks and Large Language Models',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <div id="__next">
          {children}
        </div>
      </body>
    </html>
  )
}