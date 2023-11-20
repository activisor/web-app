/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { useSession } from 'next-auth/react';
import ScheduleInput from '@/components/schedule-input';
import { readItem, saveItem, GENERATION_REQUESTED, SCHEDULE_DATA } from '@/client-lib/local-storage';
import type { ScheduleData } from '@/lib/schedule-data';

export default function Home() {
    const { data: session, status } = useSession();

    // if token detected, get DTO, compress & redirect to /schedule with payload
    if (status === "authenticated") {
        const generationRequested = readItem(GENERATION_REQUESTED);
        if (!generationRequested) {
            saveItem(GENERATION_REQUESTED, true);
            const dto: ScheduleData = readItem(SCHEDULE_DATA);
            // make API call, redirect on result

            fetch('/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle API response data here
                    console.log(data);
                    window.open(data.url, '_self');
                })
                .catch(error => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }

        return (
            <main>
                <h1 css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>Building Your Schedule</h1>
            </main>
        );
    }

    return (
        <main >
            <h1 css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>Activisor</h1>
            <ScheduleInput />
        </main>
    );
}
