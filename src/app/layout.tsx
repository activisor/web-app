import { GoogleTagManager } from '@next/third-parties/google';
import { Providers } from '@/client-lib/provider';
import { publicRuntimeConfig } from '@/lib/app-constants';
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })
const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID as string

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <GoogleTagManager gtmId={GTM_ID} />
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
