import type { Metadata } from 'next'
import Link from '@mui/material/Link';
import { Providers } from '../client-lib/provider';
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Activisor - Group Activity Management',
    description: 'Activisor creates Google Sheets schedules that ensure balanced participation and mingling among your group members.',
    applicationName: 'Activisor'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <footer>
                        <Link href="/privacy" underline="hover">Privacy Policy</Link>
                        <Link href="/tos" underline="hover">Terms of Service</Link>
                        <Link href="mailto:info@activisor.com" underline="hover" rel="noopener">info@activisor.com</Link>
                        <Link href="https://www.google.com/sheets/about/" underline="hover" rel="noopener">Google Sheets, a trademark of Google LLC</Link>
                    </footer>
                </Providers>
            </body>
        </html>
    )
}
