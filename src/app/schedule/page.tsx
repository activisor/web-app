/** @jsxImportSource @emotion/react */
'use client'

// import { css } from '@emotion/react'
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import LogoButton from '@/components/logo-button';
import ScheduleInput from '@/components/schedule-input';
import { readItem, saveItem, hasStorage, GENERATION_REQUESTED, SCHEDULE_DATA } from '@/client-lib/local-storage';
import { useMixPanel } from '@/client-lib/analytics';
import { publicRuntimeConfig } from '@/lib/app-constants';
import type { Participant } from '@/lib/participant';
import type { ScheduleData } from '@/lib/schedule-data';
import { decode } from '@/lib/base64-convert';

export default function Schedule() {
    const mixpanel = useMixPanel();
    const { data: session, status } = useSession();

    const handleSubmit = () => {
        mixpanel.track('Submit schedule');

        if (status === 'authenticated' || publicRuntimeConfig.UX_DEV_MODE) {
            window.location.href = publicRuntimeConfig.SIGNIN_REDIRECT_PATH;
        } else {
            // Nextauth OpenID Connect
            signIn('google', { callbackUrl: publicRuntimeConfig.SIGNIN_REDIRECT_PATH });
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (hasStorage()) {
            saveItem(GENERATION_REQUESTED, false);
            // get 'data' query param, if present

            let paramData = params.get('data');
            // then base64 decode and save to local storage if not already present
            if (paramData) {
                const emailExtract = decode(paramData);
                let participantIndex = 1;

                emailExtract.participants.forEach((participant: Participant) => {
                    participant.isHalfShare = false;
                    participant.id = Date.now() + participantIndex;
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
                paddingTop: 16
            }
        }}>
            <div>
                <LogoButton />
                <ScheduleInput handleSubmit={handleSubmit} />
            </div>
        </main>
    );
}
