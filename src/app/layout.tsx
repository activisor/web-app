import type { Metadata } from 'next'
import { Providers } from '../client-lib/provider';
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Activisor',
    description: 'Generates schedules for your team.',
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
                <Providers>{children}</Providers>
                <footer>
                    <p><a href="/privacy">Privacy Policy</a></p>
                    <p><a href="/tos">Terms of Service</a></p>
                    <p><a href="mailto:info@activisor.com" target="_blank" rel="noopener noreferrer">info@activisor.com</a></p>
                </footer>
            </body>
        </html>
    )
}
