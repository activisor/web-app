/** @jsxImportSource @emotion/react */
'use client'

import Image from 'next/image';
import { css } from '@emotion/react';
import Grid from '@mui/material/Unstable_Grid2';
import East from '@mui/icons-material/East';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import { useTheme } from '@mui/material/styles';
import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button';
import { mq } from '@/lib/media-queries';

const schedulerToEmail = 'schedule@mail.activisor.com';
const heroSectionCss = css({
    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 1.0),rgba(255, 255, 255, 0.5)), url(/pickleball-1920x1200.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh'
});

const ctaRowCss = css({
    /* theme primary light */
    backgroundColor: 'rgba(187, 222, 251, 0.3)',
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    '& > svg': {
        marginRight: 16,
    },
});

const handleClick = () => {
    window.location.href = '/schedule';
};

export default function Home() {
    const theme = useTheme();
    const ctaEmailCss = css({
        color: theme.palette.secondary.main,
        fontWeight: 'bold',
        paddingRight: 8,
    });
    const listItemTitleCss = css({
        color: theme.palette.primary.dark,
        fontWeight: 'bold',
        paddingRight: 8,
    });

    return (
        <main css={{
        }}>
            <div id="hero-section" css={css`
                background-image: linear-gradient(to right, rgba(255, 255, 255, 1.0),rgba(255, 255, 255, 0.5)), url(/pickleball-1920x1200.jpg);
                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
                height: 100vh;
            `}>
                <Grid container spacing={2} css={{
                    height: '100%',
                    alignItems: 'stretch',
                    [mq.md]: {
                        padding: 16,
                    },
                    [mq.xl]: {
                        padding: 24,
                    }
                }}>
                    <Grid md={6} xl={5} css={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 8,
                        [mq.md]: {
                            padding: 24,
                        },
                        [mq.xl]: {
                            padding: 32,
                        }
                    }}>
                        <div>
                            <Image src="/ShortLogo_Transparent.png" width={200} height={90} alt="Activisor logo" />
                        </div>
                        <div css={{
                            // marginTop: 32,
                            // marginBottom: 32,
                        }}>
                            <h1 css={{
                                color: theme.palette.primary.main,
                                backdropFilter: 'blur(1px)',
                            }}>Effortlessly Schedule Your Group Activities</h1>
                            <p css={{
                                backdropFilter: 'blur(1px)',
                                fontWeight: 'bold',
                            }}>Streamline your group scheduling with Activisor. We create Google Sheet schedules that ensure even participation and mixing. Enjoy seamless customization and full control over your schedule, commitment-free. Get up and running instantly – Activisor is designed for organizers who value simplicity and flexibility. Try it now and transform the way you manage your group&apos;s events!</p>
                        </div>
                        <Paper elevation={8} css={{
                            padding: 16,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(4px)',
                        }}>
                            <h2 css={{
                                color: theme.palette.primary.main,
                                marginTop: 0,
                            }}>Pick a way to start</h2>
                            <div css={{
                                // backgroundColor: 'rgba(255, 255, 255, 0.4)'
                            }}>
                                <div css={css`${ctaRowCss};`}><East color="secondary" /><span>Forward your group email to&nbsp;</span><span css={css`${ctaEmailCss};`}>{schedulerToEmail}</span><CopyToClipboardButton value={schedulerToEmail} color={'secondary'}></CopyToClipboardButton></div>
                                <div css={css`${ctaRowCss};`}><East color="secondary" />
                                    <Button
                                        variant='outlined'
                                        type="submit"
                                        color="secondary"
                                        onClick={handleClick}
                                    >enter emails</Button>
                                </div>
                            </div>
                        </Paper>

                    </Grid>
                    <Grid md={1} xl={2}>
                    </Grid>
                    <Grid md={5} xl={5} css={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        [mq.md]: {
                            padding: 16,
                        },
                        [mq.xl]: {
                            padding: 24,
                        }
                    }}>
                        <Paper elevation={1} css={{
                            padding: 16,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(4px)',
                        }}>
                            <img src="/pickleball-schedule-sm.png" css={css`
                                width: 100%;
                            `} />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            <div css={{
                padding: 16,
                [mq.md]: {
                    padding: 24,
                },
                [mq.xl]: {
                    padding: 32,
                }
            }}>
                <p>
                    Are you tired of spending hours crafting schedules for your group activities? Activisor is the game-changing web app designed to simplify the lives of organizers like you, providing a hassle-free solution to create Google Sheet schedules for your recurring events.
                </p>
                <ul css={{
                    '& > li': {
                        marginBottom: 16
                    }
                }}>
                    <li>
                        <span css={css`${listItemTitleCss};`}>Effortless Scheduling:</span>Activisor takes the pain out of scheduling by automating the process. No more wrestling with complex algorithms or spending hours trying to ensure everyone gets equal participation time. Our platform intelligently creates a schedule that both balances participation and mixes up the group on each date. With just a few clicks, you can have a perfectly tailored schedule ready for your group.
                    </li>
                    <li>
                        <span css={css`${listItemTitleCss};`}>Seamless Customization:</span>We understand that every group is unique, and Activisor gives you the power to customize your schedule effortlessly. As the organizer, you retain full control over the Google Sheet, allowing you to make edits and adjustments according to your group&apos;s specific needs. Whether you want to change playing spots, add special events, or adapt the schedule to evolving requirements, Activisor lets you do it all with ease.
                    </li>
                    <li>
                        <span css={css`${listItemTitleCss};`}>Zero Commitment, Small Transaction Fee:</span>Say goodbye to the learning curve and subscription fees that come with comprehensive proprietary systems. Activisor believes in empowering organizers without binding them to long-term commitments. Enjoy the flexibility of our service with a small transaction fee, giving you access to the tools you need without the burden of unnecessary features or hidden costs. Activisor ensures you only pay for what you use, making it a cost-effective and efficient solution.
                    </li>
                    <li>
                        <span css={css`${listItemTitleCss};`}>Instantly Up and Running:</span>Already familiar with Google Sheets? Activisor is designed with you in mind. Instantly integrate our platform into your workflow without a steep learning curve. You&apos;ll be up and running in no time, leveraging the full potential of Google Sheets combined with the smart scheduling capabilities of Activisor.
                    </li>
                </ul>
                <p>
                    Activisor is the ultimate solution for group organizers who seek a straightforward, customizable, and commitment-free way to create and manage schedules. With Activisor, you&apos;re in control, allowing you to focus on what matters most – enjoying your group activities. Try Activisor today and experience scheduling simplicity like never before.
                </p>
            </div>
        </main>
    );
}
