/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { useSession } from 'next-auth/react';
import Skeleton from '@mui/material/Skeleton';
import ScheduleInput from '@/components/schedule-input';
import { readItem, saveItem, GENERATION_REQUESTED, SCHEDULE_DATA } from '@/client-lib/local-storage';
import type { ScheduleData } from '@/lib/schedule-data';

export default function Home() {
    const { data: session, status } = useSession();
    const generationRequested: boolean = readItem(GENERATION_REQUESTED) as boolean;
    const testFlag: boolean = generationRequested && true;
    const sampleData = 'test_data';

    const scrimCss = generationRequested ? css({
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '100vh',
        minWidth: '100vw',
        backdropFilter: 'blur(2px)',
        zIndex: 100,
    }) : css({
        display: 'none',
    });

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
        width: '10%',
        marginRight: 4,
        '@media(min-width: 1248px)': {
            marginRight: 4,
        }
    });

    const buildSkeletonCell2Css = css({
        width: '90%'
    });

    // if token detected, get DTO, compress & redirect to /schedule with payload
    if (status === "authenticated") {
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
                    <h1 css={{
                        textAlign: 'center',
                        marginBottom: '10vh',
                        '@media(max-width: 1247px)': {
                            marginTop: 8
                        }
                    }}>Building Your Schedule</h1>
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
            </main>
        );
    }

    return (
        <main css={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            /* breakpoint for large screen overrides, 1280px wide */
            '@media(min-width: 1248px)': {
                marginTop: 16
            }
        }}>
            <div>
                <h1 css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '@media(max-width: 1247px)': {
                        marginTop: 8
                    }
                }}>Activisor</h1>
                <ScheduleInput />
            </div>
            <div id="scrim" css={scrimCss}></div>
        </main>
    );
}
