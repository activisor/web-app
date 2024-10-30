import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Activisor - Group Activity Schedules and Management',
    description: 'Activisor creates smart Google Sheets schedules for recurring recreational group and team meetings and then actively manages attendance.',
    applicationName: 'Activisor',
    robots: {
        index: false,
        follow: false,
    }
}

export default function NoIndexLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}