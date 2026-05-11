import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Garv Urja Solutions — MNRE Registered Solar EPC Company',
  description:
    'Garv Urja Solutions designs, builds and maintains rooftop & ground-mount solar systems. Trusted solar EPC partner for residential, commercial and industrial clients.',
  keywords: 'solar EPC, rooftop solar, Alwar, Rajasthan, solar installation, solar O&M, MNRE registered',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grain">
        {children}
      </body>
    </html>
  )
}
