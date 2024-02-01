/** @jsxImportSource @emotion/react */
'use client'

import Image from 'next/image';
import { css } from '@emotion/react';
import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import East from '@mui/icons-material/East';
import Info from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

import { useTheme } from '@mui/material/styles';
import CopyToClipboardButton from '@/components/copy-to-clipboard-button';
import ImageDialog from '@/components/image-dialog';
import { mq } from '@/lib/media-queries';

const schedulerToEmail = 'schedule@mail.activisor.com';

const heroSectionCss = css({
    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 1.0),rgba(255, 255, 255, 0.5)), url(/pickleball-1920x1200.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [mq.md]: {
        height: '100vh'
    },
});

const paperCss = css({
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(5px)',
});

const ctaRowCss = css({
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
        marginRight: 12,
    },
    '@media (max-width: 400px)': {
        // hide arrouws on smallest screens
        '& > svg': {
            display: 'none',
        },
        '& > button': {
            marginLeft: 56,
        },
    },
    [mq.md]: {
        '& > svg': {
            marginRight: 16,
        },
    },
});

const ctaEmailBlockCss = css({
    [mq.sm]: {
        display: 'flex',
        alignItems: 'center',
    },
    [mq.md]: {
        display: 'block',
    },
    [mq.xl]: {
        display: 'flex',
        alignItems: 'center',
    },
});

const handleClick = () => {
    window.location.href = '/schedule';
};

export default function Home() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();

    const itemTitleCss = css({
        color: theme.palette.primary.dark,
        fontWeight: 'bold',
        paddingRight: 8,
    });

    const ctaSectionCss = css({
        /* theme primary light */
        backgroundColor: 'rgba(187, 222, 251, 0.3)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: theme.palette.primary.dark,
        borderRadius: theme.shape.borderRadius,
        padding: 16,
        marginBottom: 24,
    });

    const handleForwardInfoClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <main>
            <div id="hero-section" css={heroSectionCss}>
                <Grid container spacing={2} css={{
                    height: '100%',
                    alignItems: 'stretch',
                    padding: 16,
                    [mq.xl]: {
                        padding: 24,
                    }
                }}>
                    <Grid xs={12} md={6} xl={5} css={{
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
                            <div css={{
                                backdropFilter: 'blur(2px)',
                                fontWeight: 'bold',
                                lineHeight: 2.0,
                            }}>
                                <p>Nine players sharing one pickleball court for the season? We know it&apos;s hard to create a schedule that provides a good experience for all - but it doesn&apos;t have to be. Activisor creates and shares Google Sheets schedules that ensure balanced participation and mingling among your pickleball (or any other) roster.</p>
                            </div>
                        </div>
                        <Paper elevation={1} css={[paperCss, {
                            padding: 8,
                            [mq.md]: {
                                padding: 16,
                            },
                        }]}>
                            <img src="/pickleball-schedule-sm2.png"
                                alt="four people playing pickleball"
                                css={{
                                    width: '100%',
                                    borderRadius: theme.shape.borderRadius,
                                }} />
                        </Paper>
                    </Grid>
                    <Grid xs={0} md={1} xl={2}>
                    </Grid>
                    <Grid xs={12} md={5} xl={5} css={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        [mq.md]: {
                            padding: 24,
                        },
                        [mq.xl]: {
                            padding: 32,
                        }
                    }}>
                        <Paper elevation={8} css={paperCss}>
                            <h2 css={{
                                color: theme.palette.primary.main,
                                marginTop: 0,
                            }}>Pick A Way To Start</h2>
                            <div css={[ctaSectionCss, {
                                borderWidth: 2
                            }]}>
                                <h3 css={{
                                    color: theme.palette.primary.dark,
                                    marginTop: 0,
                                }}>We Start</h3>

                                <div css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <div css={ctaEmailBlockCss}>
                                        <span>Forward your group email to&nbsp;</span>
                                        <div css={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                            <span css={itemTitleCss}>{schedulerToEmail}</span>
                                            <CopyToClipboardButton value={schedulerToEmail} valueName="email" color="secondary"></CopyToClipboardButton>
                                        </div>
                                    </div>
                                    <div>
                                        <span css={{
                                            // paddingLeft: 56,
                                            [mq.md]: {
                                            //    paddingLeft: 80,
                                            },
                                            paddingRight: 8,
                                            fontStyle: 'italic'
                                        }}>We&apos;ll get back to you!</span>
                                        <Tooltip title="see how to forward a group email">
                                            <IconButton
                                                aria-label="info"
                                                color={'primary'}
                                                onClick={handleForwardInfoClick}>
                                                <Info />
                                            </IconButton>
                                        </Tooltip>
                                        <ImageDialog
                                            name="Forwarding Your Group Email"
                                            open={dialogOpen}
                                            src="/activisor-forward-email.gif"
                                            alt="show how to forward email"
                                            height={540}
                                            width={1080}
                                            onClose={handleDialogClose} />
                                    </div>
                                </div>
                            </div>
                            <div css={[ctaSectionCss]}>
                                <h3 css={{
                                    color: theme.palette.primary.dark,
                                    marginTop: 0,
                                }}>You Start</h3>
                                <div css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <Tooltip title="open the schedule maker">
                                        <Button
                                            variant='outlined'
                                            type="submit"
                                            color="secondary"
                                            onClick={handleClick}
                                        >enter emails yourself</Button>
                                    </Tooltip>
                                </div>
                            </div>
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
                <p>Are you tired of spending hours managing your gaming or sports group&apos;s schedule? Activisor is a quick and easy way to create and share Google Sheets schedules for your recurring meetups.</p>
                <ul css={{
                    '& > li': {
                        marginBottom: 16
                    }
                }}>
                    <li>
                        <span css={css`${itemTitleCss};`}>Effortless Scheduling:</span>Some members seeing certain ones too often and others hardly at all?  No more hours spent trying to ensure a good experience for everyone on the roster; Activisor both balances participation and evenly mixes up the lineups across all your dates. In a couple of minutes, Activisor can share with your group a perfectly tailored schedule with any activity costs fairly shared.
                    </li>
                    <li>
                        <span css={css`${itemTitleCss};`}>Low Investment, No Commitment:</span>Don&apos;t need a registration service, website, and merchandise store bundled with your schedule? Say goodbye to the baggage and subscription fees. For a small one-time fee, you get just the schedule you want. No strings attached.
                    </li>
                    <li>
                        <span css={css`${itemTitleCss};`}>Instantly Up and Running:</span>Already familiar with Google Sheets? Then, Activisor is designed for you. Instead of learning a new system, you&apos;ll be up and running in no time, leveraging the power of Google Sheets combined with Activisor&apos;s smart scheduling. You can easily customize your schedule according to your group&apos;s specific needs; whether you want to change playing spots, add special events, or adapt the schedule to evolving circumstances, you can do it all with ease.
                    </li>
                </ul>
                <p>
                    If you&apos;re seeking an easy and commitment-free way to create and manage your group&apos;s schedule, Activisor is for you. With Activisor, you&apos;re in control, allowing you to focus on what matters most – enjoying your group activities!
                </p>
            </div>
        </main>
    );
}
