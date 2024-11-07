import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Schedule Maker for practices and recurring group events",
    description: "Schedule Maker creates a Google Sheets schedule for recreational groups and teams that evenly mixes member participation among all of the schedule's dates",
    applicationName: 'Activisor'
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}