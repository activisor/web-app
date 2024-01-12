/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { useSession } from 'next-auth/react';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import LogoButton from '@/components/logo-button';
import { readItem, saveItem, hasStorage, GENERATION_REQUESTED, SCHEDULE_DATA } from '@/client-lib/local-storage';
import { useMixPanel } from '@/client-lib/mixpanel';
import type { ScheduleData } from '@/lib/schedule-data';
import { encode } from '@/lib/base64-convert';

export default function Building() {
    const mixpanel = useMixPanel();
    const theme = useTheme();
    const { data: session, status } = useSession();
    const generationRequested: boolean = readItem(GENERATION_REQUESTED) as boolean;

    const buildSkeletonRowCss = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 4,
        '@media(min-width: 1248px)': {
            marginBottom: 8
        }
    });

    const buildSkeletonCell1Css = css({
        backgroundColor: theme.palette.primary.light,
        width: '10%',
        marginRight: 4,
        '@media(min-width: 1248px)': {
            marginRight: 4,
        }
    });

    const buildSkeletonCell2Css = css({
        backgroundColor: theme.palette.primary.light,
        width: '90%'
    });

    // if token detected, get DTO, compress & redirect to /api/schedule with payload
    if (status === "authenticated") {
        if (session.user?.email) {
            mixpanel.identify(session.user.email);
        }

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
                    const encodedData = encode(data);
                    window.location.href = `/result?data=${encodedData}`;
                })
                .catch(error => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }
    }

    return (
        <main css={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            /* breakpoint for large screen overrides, 1280px wide */
            '@media(min-width: 1248px)': {
                marginTop: 16
            }
        }}>
            <div css={{
                width: '100%',
                height: '100vh',
                '@media(min-width: 1248px)': {
                    width: '50%'
                }
            }}>
                <LogoButton />
                <h1 css={{
                    color: theme.palette.primary.main,
                    textAlign: 'center',
                    marginBottom: '10vh',
                    '@media(max-width: 1247px)': {
                        marginTop: 8
                    }
                }}>Building Your Schedule</h1>
                <div css={{
                    padding: 16,
                }}>
                    <div css={buildSkeletonRowCss}>
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell1Css} />
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell2Css} />
                    </div>
                    <div css={buildSkeletonRowCss}>
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell1Css} />
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell2Css} />
                    </div>
                    <div css={buildSkeletonRowCss}>
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell1Css} />
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell2Css} />
                    </div>
                    <div css={buildSkeletonRowCss}>
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell1Css} />
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell2Css} />
                    </div>
                    <div css={buildSkeletonRowCss}>
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell1Css} />
                        <Skeleton variant="rectangular" height={'5vh'} css={buildSkeletonCell2Css} />
                    </div>
                </div>
            </div>
        </main>
    );
}