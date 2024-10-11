import type { Metadata } from 'next'
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
                </Providers>
            </body>
        </html>
    )
}
