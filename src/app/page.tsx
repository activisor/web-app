/** @jsxImportSource @emotion/react */
'use client'

import Image from 'next/image';
import { css } from '@emotion/react';
import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Info from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

import { useTheme } from '@mui/material/styles';
import CopyToClipboardButton from '@/components/copy-to-clipboard-button';
import ImageDialog from '@/components/image-dialog';
// import { publicRuntimeConfig } from '@/lib/config';
import { mq, breakpoints } from '@/lib/media-queries';

const schedulerToEmail = 'schedule@mail.activisor.com';

const heroSectionCss = css({
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(to right, rgba(255, 250, 223, 1.0),rgba(255, 250, 223, 0.5)), url(/pickleball-1920x1200.jpg)',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [mq.md]: {
        height: '100vh'
    },
});

const paperCss = css({
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(5px)',
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

const itemTitleCss = css({
    fontWeight: 'bold',
    paddingRight: 8,
    // prevent wrapping
    [`@media (min-width: ${breakpoints[3]}px) and (max-width: 1700px)`]: {
        paddingRight: 4,
    },
});

const italicTextCss = css({
    fontStyle: 'italic',
});

const handleClick = () => {
    window.location.href = '/schedule';
};

export default function Home() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();

    const altTextColorCss = css({
        color: theme.palette.primary.dark,
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
                            }}>Effortlessly Manage Your Group Activities</h1>
                            <div css={{
                                backdropFilter: 'blur(2px)',
                                fontWeight: 'bold',
                                [mq.xl]: {
                                    lineHeight: 2.0,
                                },
                            }}>
                                <p>Nine players sharing one court for the season? We know it&apos;s hard to create a schedule that provides a good experience for all and then coordinate attendance - but it doesn&apos;t have to be. Activisor can be your group manager,
                                integrating with the Google apps you use every day to make it easy. Play more and stress less.
                                </p>
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
                        <Paper elevation={10} css={paperCss}>
                            <h2 css={{
                                color: theme.palette.primary.dark,
                                marginTop: 0,
                            }}>Pick A Way To Start</h2>
                            <div css={[ctaSectionCss, {
                                borderWidth: 3
                            }]}>
                                <h3 css={[altTextColorCss, {
                                    marginTop: 0,
                                }]}>We Start</h3>

                                <div css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <div css={ctaEmailBlockCss}>
                                        <span>Forward your roster group email to&nbsp;</span>
                                        <div css={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                            <span css={itemTitleCss}>{schedulerToEmail}</span>
                                            <CopyToClipboardButton value={schedulerToEmail} valueName="email" color="secondary" fontSize="large"></CopyToClipboardButton>
                                        </div>
                                    </div>
                                    <div>
                                        <span css={[italicTextCss, altTextColorCss, {
                                            // paddingLeft: 56,
                                            [mq.md]: {
                                                //    paddingLeft: 80,
                                            },
                                            paddingRight: 8,
                                        }]}>We&apos;ll get back to you!</span>
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
                                            tagLine="Look for our email response!"
                                            height={540}
                                            width={1080}
                                            onClose={handleDialogClose} />
                                    </div>
                                </div>
                            </div>
                            <div css={[ctaSectionCss]}>
                                <h3 css={[altTextColorCss, {
                                    marginTop: 0,
                                }]}>You Start</h3>
                                <div css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <Tooltip title="open the schedule maker">
                                        <Button
                                            variant='outlined'
                                            type="submit"
                                            size="large"
                                            color="secondary"
                                            onClick={handleClick}
                                        >enter roster yourself</Button>
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
                <h3 css={altTextColorCss}>How It Helps</h3>
                <p>Are you tired of spending hours managing your gaming or sports group&apos;s schedule? Activisor is a quick and easy way to create and share Google Sheets schedules for recurring meetups and then get the right people to the right place at the right time.</p>
                <ul css={{
                    '& > li': {
                        marginBottom: 16
                    }
                }}>
                    <li>
                        <span css={[altTextColorCss, itemTitleCss]}>Effortless Scheduling:</span>Some members seeing certain ones too often and others hardly at all?  No more hours spent trying to ensure a good experience for everyone on the roster; Activisor both balances participation and evenly mixes up the lineups across all your dates. In a couple of minutes, Activisor can publish a schedule to your group with any activity costs fairly shared.
                    </li>
                    <li>
                        <span css={[altTextColorCss, itemTitleCss]}>Reduce Attendance Problems:</span>It can be a hassle to keep track of who&apos;s coming and who&apos;s not. Activisor makes it easy to manage attendance and communicate with your group.
                    </li>
                    <li>
                        <span css={[altTextColorCss, itemTitleCss]}>Embedded In Your Daily Routine:</span>Activisor is built on the apps you already use every day so you&apos;ll always be on top of things.
                    </li>
                </ul>
                <br></br>
                <h3 css={altTextColorCss}>How It Works</h3>
                <ol css={{
                    '& > li': {
                        marginBottom: 16
                    }
                }}>
                    <li>Enter some basic info about your schedule, such as your roster, when meetings occur, and overall cost (if any). <span css={[italicTextCss, altTextColorCss]}>Forward your roster group email to us and we can import their contact info.</span></li>
                    <li>Authorize Google to grant access to Activisor in order for us to create your schedule. <span css={[italicTextCss, altTextColorCss]}>We don&apos;t touch anything else.</span></li>
                    <li>Pay as little as $1. <span css={[italicTextCss, altTextColorCss]}>Then, your imagination is the limit to how you use and customize it.</span></li>
                </ol>
                <br></br>
                <br></br>
                <h3 css={altTextColorCss}>About Us</h3>
                <p>Activisor strives to transform recreational group organization and management into a joyous and stress-free experience.</p>
            </div>
        </main>
    );
}
