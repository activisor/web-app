import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy - Activisor',
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