import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Activisor - Privacy Policy',
    description: "Activisor's privacy policy",
    applicationName: 'Activisor'
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}