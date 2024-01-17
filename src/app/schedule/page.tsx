/** @jsxImportSource @emotion/react */
'use client'

// import { css } from '@emotion/react'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import LogoButton from '@/components/logo-button';
import ScheduleInput from '@/components/schedule-input';
import { readItem, saveItem, hasStorage, GENERATION_REQUESTED, SCHEDULE_DATA } from '@/client-lib/local-storage';
import { publicRuntimeConfig } from '@/lib/app-constants';
import type { Participant } from '@/lib/participant';
import type { ScheduleData } from '@/lib/schedule-data';
import { decode } from '@/lib/base64-convert';

export default function Schedule() {
    const { data: session, status } = useSession();

    const handleSubmit = () => {
        if (status === 'authenticated') {
            window.location.href = publicRuntimeConfig.AUTH_REDIRECT_PATH;
        } else {
            // Nextauth OpenID Connect
            signIn('google');
        }
    }

    useEffect(() => {
        if (hasStorage()) {
            saveItem(GENERATION_REQUESTED, false);
            // get 'data' query param, if present
            const params = new URLSearchParams(window.location.search);
            let paramData = params.get('data');
            // then base64 decode and save to local storage if not already present
            if (paramData && !readItem(SCHEDULE_DATA)) {
                const emailExtract = decode(paramData);

                let participantIndex = 1;
                emailExtract.participants.forEach((participant: Participant) => {
                    participant.id = participantIndex;
                    participantIndex++;
                });

                const scheduleData: ScheduleData = {
                    participants: emailExtract.participants,
                    scheduleName: emailExtract.subject,
                };
                saveItem(SCHEDULE_DATA, scheduleData);
            }
        }

    }, []);

    return (
        <main css={{
            display: 'flex',
            justifyContent: 'center',
            minWidth: '100vw',
            /* breakpoint for large screen overrides, 1280px wide */
            '@media(min-width: 1248px)': {
                marginTop: 16
            }
        }}>
            <div>
                <LogoButton />
                <ScheduleInput handleSubmit={handleSubmit} />
            </div>
        </main>
    );
}
