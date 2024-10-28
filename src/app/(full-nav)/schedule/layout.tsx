import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Activisor - Schedules for recurring recreational group events',
    description: "Schedule Maker creates a Google Sheets schedule for the user that evenly randomizes member participation among all of the schedule's events",
    applicationName: 'Activisor'
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}