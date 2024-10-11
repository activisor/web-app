import type { Metadata } from 'next'
import Link from '@mui/material/Link';
import { Providers } from '@/client-lib/provider';

export default function FullNavLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            {children}
            <footer>
                <Link href="/privacy" underline="hover">Privacy Policy</Link>
                <Link href="/tos" underline="hover">Terms of Service</Link>
                <Link href="mailto:info@activisor.com" underline="hover" rel="noopener">info@activisor.com</Link>
                <Link href="https://www.google.com/sheets/about/" underline="hover" rel="noopener">Google Sheets, a trademark of Google LLC</Link>
            </footer>
        </section>
    )
}
