import type { Metadata } from 'next'
import { DM_Serif_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import NavClient from '@/components/NavClient'
import Footer from '@/components/Footer'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Simba Shi',
  description: 'CS + Math at Yale. Building AI systems that work in the real world.',
  openGraph: {
    title: 'Simba Shi',
    description: 'CS + Math at Yale. Building AI systems that work in the real world.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${inter.variable} ${mono.variable}`}
    >
      <head>
        {/* Prevents flash of wrong theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}})()`,
          }}
        />
      </head>
      <body className="bg-bg text-fg font-sans antialiased min-h-screen flex flex-col">
        <NavClient />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
