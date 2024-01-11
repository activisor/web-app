import type { Metadata } from 'next'
import { Providers } from '../client-lib/provider';
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Activisor Effortlessly Schedules Your Recreational and Sports Group Activities',
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
                    <p><a href="/privacy">Privacy Policy</a></p>
                    <p><a href="/tos">Terms of Service</a></p>
                    <p><a href="mailto:info@activisor.com" target="_blank" rel="noopener noreferrer">info@activisor.com</a></p>
                    <p><a href="https://www.google.com/sheets/about/" target="_blank" rel="noreferrer noopener">Google Sheets is a trademark of Google LLC</a></p>
                </footer>
            </body>
        </html>
    )
}
