import type { Metadata } from 'next'
import { Providers } from '../client-lib/provider';
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Activisor - Instant Schedules for Recreational and Sports Groups',
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
                <Providers>{children}</Providers>
                <footer>
                    <p><a href="/privacy"><b>Privacy Policy</b></a></p>
                    <p><a href="/tos"><b>Terms of Service</b></a></p>
                    <p><a href="mailto:info@activisor.com" target="_blank" rel="noopener noreferrer"><b>info@activisor.com</b></a></p>
                    <p><a href="https://www.google.com/sheets/about/" target="_blank" rel="noreferrer noopener"><b>Google Sheets is a trademark of Google LLC</b></a></p>
                </footer>
            </body>
        </html>
    )
}
