/** @jsxImportSource @emotion/react */
'use client'


import { css } from '@emotion/react';
import Grid from '@mui/material/Unstable_Grid2';
import East from '@mui/icons-material/East';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button';
import { mq } from '@/lib/media-queries';

const schedulerToEmail = 'schedule@mail.activisor.com';
const heroSectionCss = css({
    backgroundImage: 'url(/pickleball-lg.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
});

const ctaRowCss = css({
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
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

    return (
        <main css={{
        }}>
            <div id="hero-section" css={css`
                background-image: linear-gradient(to right, rgba(255, 255, 255, 0.9),rgba(255, 255, 255, 0.3)), url(/pickleball-lg.jpg);
                background-repeat: no-repeat;
                background-size: cover;
                height: 1020px;
            `}>

                <Grid container spacing={2} css={{
                }}>
                    <Grid md={6} xl={5} css={{
                        padding: 16,
                        [mq.md]: {
                            padding: 24,
                        },
                        [mq.xl]: {
                            padding: 32,
                        }
                    }}>

                        <h1>Effortless Scheduling for Your Group Activities</h1>
                        <p>Streamline your group scheduling with Activisor. We create Google Sheet schedules that ensure even participation and mixing. Enjoy seamless customization and full control over your schedule, subscription-free. Get up and running instantly – Activisor is designed for organizers who value simplicity and flexibility. Try it now and transform the way you manage your group&apos;s events!</p>
                        <h2 css={{
                            marginTop:32,
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
                    </Grid>
                    <Grid md={1} xl={2}>
                    </Grid>
                    <Grid md={5} xl={5}>

                    </Grid>
                </Grid>

            </div>
        </main>
    );
}
