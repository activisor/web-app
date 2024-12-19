/** @jsxImportSource @emotion/react */
'use client';

import { css } from '@emotion/react';
import Grid from '@mui/material/Unstable_Grid2';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useTheme, withTheme } from '@mui/material/styles';
import CopyToClipboardButton from '@/components/copy-to-clipboard-button';
import ImageDialog from '@/components/image-dialog';
import { mq, breakpoints, xsbp } from '@/lib/media-queries';

const schedulerToEmail = 'schedule@mail.activisor.com';

const heroSectionCss = css({
    backgroundColor: '#FFFFFF',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [mq.md]: {
        height: '100vh'
    },
});

const heroImageCss = css({
    backgroundImage: 'linear-gradient(rgba(255, 250, 223, 1.0),rgba(255, 250, 223, 0.5)), url(/pickleball-1920x1200.jpg)',
    [mq.md]: {
        backgroundImage: 'linear-gradient(to right, rgba(255, 250, 223, 1.0),rgba(255, 250, 223, 0.5)), url(/pickleball-1920x1200.jpg)',
    },
});

const columnCss = css({
    display: 'flex',
    flexDirection: 'column',
});

const headlineBlockCss = css({
    fontWeight: 'bold',
    fontSize: '20px',
    paddingLeft: 24,
    [mq.md]: {
        paddingLeft: 32,
        fontSize: '24px',
    },
    [mq.xl]: {
        paddingLeft: 40,
        paddingBottom: 16,
    },
    p: {
        marginBlockStart: '0.5em',
        marginBlockEnd: '0.5em',
        [mq.xl]: {
            marginBlockStart: '1em',
            marginBlockEnd: '1em',
        },
    }
});

const headlineCss = css({
    display: 'flex',
    '& > h3': {
        marginTop: 12,
        marginBottom: 12,
        fontSize: '20px',
        backdropFilter: 'blur(2px)',
    },
    alignItems: 'baseline',
    [mq.sm]: {
        alignItems: 'center',
    },
    [mq.xl]: {
        '& > h3': {
            fontSize: '28px',
        },
    }
});

const paperCss = css({
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(5px)',
});

const checkCss = css({
    marginRight: 16,
})

const italicTextCss = css({
    fontStyle: 'italic',
});

const itemTitleCss = css({
    fontWeight: 'bold',
    paddingRight: 8,
    // prevent wrapping
    [`@media (min-width: ${breakpoints[3]}px) and (max-width: 1700px)`]: {
        paddingRight: 4,
    },
});

const ctaEmailBlockCss = css({
    marginRight: -8,    // exclude button padding from centering
    '& > *': {
        whiteSpace: 'nowrap',
    },
    [`@media (max-width: ${xsbp}px)`]: {
        '& button': {
            paddingRight: 0,
        },
    },
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

const schedulerToEmailCss = css({
    [`@media (max-width: ${xsbp}px)`]: {
        fontSize: '14px',
    },
});

const handleClick = () => {
    window.location.href = '/schedule';
};

export default function HeroSection() {
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
        h2: {
            fontSize: '20px',
        },
        [mq.xl]: {
            h2: {
                fontSize: '24px',
            }
        },
    });

    const getHeadline = (text: string) => {
        return (
            <div css={headlineCss}>
                <DoneOutlineIcon css={checkCss} />
                <h3>{text}</h3>
            </div>
        );
    };

    return (
        <div id="hero-section" css={[heroSectionCss, heroImageCss]}>
            <Grid container spacing={2} css={{
                height: '100%',
                alignItems: 'stretch',
                padding: 16,
                [mq.xl]: {
                    padding: 24,
                }
            }}>
                <Grid id="col-1" xs={12} md={6} xl={5} css={[columnCss, {
                    justifyContent: 'space-between',
                    padding: 8,
                    [mq.md]: {
                        padding: 16,
                    },
                    [mq.xl]: {
                        padding: '32px 16px 32px 32px',
                    }
                }]}>
                    <div>
                        <Image src="/ShortLogo_Transparent.png" width={200} height={90} alt="Activisor logo" />
                    </div>
                    <div css={{
                        paddingBottom: 16,
                        [mq.md]: {
                            paddingBottom: 0,
                        }
                    }}>
                        <div css={[headlineBlockCss, altTextColorCss]}>
                            {getHeadline('Creates schedules for your group or team')}
                            {getHeadline('Actively manages attendance')}
                        </div>
                        <h2 css={{
                            color: theme.palette.secondary.dark,
                            backdropFilter: 'blur(2px)',
                            fontSize: '28px',
                            letterSpacing: '6px',
                            marginBottom: 0,
                            [mq.xl]: {
                                marginBottom: 16,
                            },
                        }}>YOU</h2>
                        <div css={[headlineBlockCss, altTextColorCss]}>
                            {getHeadline('Play more and stress less')}
                        </div>
                    </div>
                    <Paper elevation={1} css={[paperCss, {
                        padding: 8,
                        [mq.md]: {
                            padding: 16,
                        },
                    }]}>
                        <img src="/pickleball-schedule-sm2.png"
                            alt="weekly schedule for pickleball group"
                            css={{
                                width: '100%',
                                borderRadius: theme.shape.borderRadius,
                            }} />
                    </Paper>
                </Grid>
                <Grid id="col-2" xs={0} md={1} xl={2} css={[columnCss, {
                    justifyContent: 'flex-end',
                }]}>
                    <div css={{
                        display: 'none',
                        [mq.md]: {
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }
                    }}>
                        <KeyboardDoubleArrowDownIcon fontSize="large" color="disabled"></KeyboardDoubleArrowDownIcon>
                    </div>

                </Grid>
                <Grid id="col-3" xs={12} md={5} xl={5} css={[columnCss, {
                    justifyContent: 'flex-end',
                    [mq.md]: {
                        padding: 16,
                    },
                    [mq.xl]: {
                        padding: '32px 32px 32px 16px',
                    }
                }]}>
                    <div css={[headlineBlockCss, altTextColorCss, {
                        [mq.xl]: {
                            paddingLeft: 32,
                        },
                    }]}>
                        <div css={headlineCss}>
                            <h3>Preview your schedule now!</h3>
                        </div>
                    </div>
                    <Paper elevation={10} css={[paperCss, {
                        paddingBottom: 24,
                        // secondary main #FF9900
                        border: '16px solid',
                        borderColor: 'rgb(255, 153, 0, 0.3)',
                        [mq.xl]: {
                            border: '20px solid',
                            borderColor: 'rgb(255, 153, 0, 0.3)',
                        }
                    }]}>
                        <h1 css={{
                            marginTop: 0,
                            marginBottom: 8,
                            [mq.xl]: {
                                marginBottom: 16,
                            }
                        }}>Choose How To Create Your Schedule</h1>
                        <div css={[ctaSectionCss, {
                            borderWidth: 3,
                            marginBottom: 16,
                            [mq.xl]: {
                                marginBottom: 24,
                            },
                        }]}>
                            <h2 css={{
                                marginTop: 0,
                                marginBottom: 8,
                                [mq.xl]: {
                                    marginBottom: 0,
                                },
                            }}>Send Your Roster</h2>
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
                                        <span css={[itemTitleCss, schedulerToEmailCss]}>{schedulerToEmail}</span>
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
                                    <ImageDialog
                                        name="Forwarding Your Group Email"
                                        src="/activisor-forward-email.gif"
                                        alt="show how to forward email"
                                        height={540}
                                        width={1080}
                                        tagLine="Look for our email response!"
                                        tooltip="see how to forward a group email"
                                    />
                                </div>
                            </div>
                        </div>
                        <div css={[ctaSectionCss, {
                            paddingBottom: 24,
                            marginBottom: 0,
                        }]}>
                            <h2 css={{
                                marginTop: 0,
                                marginBottom: 16,
                            }}>Enter Your Roster</h2>
                            <div css={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                                <Tooltip title="enter your roster in the schedule maker">
                                    <Button
                                        variant='contained'
                                        type="submit"
                                        color="secondary"
                                        onClick={handleClick}
                                    >Open Schedule Maker</Button>
                                </Tooltip>
                            </div>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}