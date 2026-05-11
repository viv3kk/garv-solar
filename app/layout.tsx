import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Garv Urja Solar — Gujarat's Trusted Solar EPC Company",
  description:
    'Garv Urja Solar Pvt. Ltd. designs, installs and maintains rooftop & ground-mount solar systems across Gujarat. 13+ years, 200+ MW commissioned.',
  keywords: 'solar EPC, rooftop solar, Gujarat, Anand, solar installation, solar O&M',
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
