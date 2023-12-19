/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import LogoButton from '@/components/logo-button';
import { decode } from '@/lib/base64-convert';
import { mq } from '@/lib/media-queries';

// editable URL: `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit?usp=sharing`;

const handleCancelClick = () => {
    window.location.href = '/schedule';
};


export default function ResultPage() {
    const [sheetId, setSheetId] = useState('');
    const [key, setKey] = useState('');

    const theme = useTheme();

    useEffect(() => {
        const sheetResult = (new URLSearchParams(window.location.search)).get('data') as string;
        const data = decode(sheetResult);
        setSheetId(data.sheetId);
        setKey(data.key);

        const sheetFrame = document.querySelector('iframe');
        if (sheetFrame && sheetFrame.contentWindow) {
            // sheetFrame.width = sheetFrame.contentWindow.document.body.scrollWidth + 'px';
            // sheetFrame.height = sheetFrame.contentWindow.document.body.scrollHeight + 'px';
        }
    }, []);

    const handleAcceptClick = () => {
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`;
        window.open(sheetUrl, '_self');
    };

    const previewUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview`;

    return (
        <main css={{
            // padding: 16
        }}>
            <Paper elevation={4} css={{
                /* theme primary light */
                backgroundColor: 'rgba(187, 222, 251, 0.3)',
            }}>
                <Grid container spacing={2} css={{
                    height: '100%',
                    alignItems: 'center',
                    padding: 16,
                    [mq.xl]: {
                        padding: 24,
                    }
                }}>
                    <Grid xs={2}><LogoButton /></Grid>
                    <Grid xs={2}></Grid>
                    <Grid xs={8}>
                        <div css={{
                            display: 'flex',
                            alignItems: 'center',
                            '& > *': {
                                margin: 16
                            }
                        }}>
                            <h3>Here is a preview of your schedule</h3>
                            <Button
                                variant='outlined'
                                type="submit"
                                color="secondary"
                                onClick={handleCancelClick}
                                css={{
                                    marginRight: 16
                                }}
                            >cancel</Button>
                            <Button
                                variant='contained'
                                type="submit"
                                color="secondary"
                                onClick={handleAcceptClick}
                            >accept</Button>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <div>
                <iframe src={previewUrl} css={{
                    border: 'none',
                    padding: 16,
                    height: '80vh',
                    width: '100%',
                }}></iframe>
            </div>
        </main>
    );
}