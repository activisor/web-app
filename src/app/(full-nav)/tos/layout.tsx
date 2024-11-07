import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service - Activisor',
    description: "Activisor's terms of service",
    applicationName: 'Activisor'
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}