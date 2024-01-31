/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { readItem, SCHEDULE_DATA } from '@/client-lib/local-storage';
import { useMixPanel } from '@/client-lib/mixpanel';
import Checkout from '@/components/checkout';
import LogoButton from '@/components/logo-button';
import { publicRuntimeConfig } from '@/lib/app-constants';
import { decode } from '@/lib/base64-convert';
import { mq } from '@/lib/media-queries';
import type { ScheduleData } from '@/lib/schedule-data';

// editable URL: `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit?usp=sharing`;

export default function ResultPage() {
    const mixpanel = useMixPanel();
    const [sheetId, setSheetId] = useState('');
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [saveDialogOpened, setSaveDialogOpened] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
    const [paymentClientId, setPaymentClientId] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [discountCodeHelperText, setDiscountCodeHelperText] = useState('');

    const theme = useTheme();
    const discountSchema = yup.object({
        email1: yup.string().email('Invalid email address'),
        discountCode: yup.string(),
        notifyParticipants: yup.boolean(),
    });

    const formik = useFormik({
        initialValues: {
            email1: '',
            discountCode: '',
            notifyParticipants: true
        },

        validationSchema: discountSchema,

        onSubmit: values => {
            // make API call to validate discount code
            const url = `/api/code-validation?code=${values.discountCode}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    // Handle API response data here
                    if (!confirmDialogOpen && data.validCode) {
                        setDiscountCodeHelperText('');
                        setSaveDialogOpen(false);
                        setConfirmDialogOpen(true);
                        if (values.notifyParticipants) {
                            requestNotifyParticipants();
                        }
                    } else {
                        if (values.discountCode) {
                            setDiscountCodeHelperText('Invalid discount code');
                        }
                        setPaymentClientId(data.paymentClientId);
                        setCurrency(data.currency);
                    }
                })
                .catch(error => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        },
    });

    useEffect(() => {
        const sheetResult = (new URLSearchParams(window.location.search)).get('data') as string;
        const data = decode(sheetResult);
        setSheetId(data.sheetId);
        const sData: ScheduleData = readItem(SCHEDULE_DATA);
        setScheduleData(sData);

        // check if server is unlocked (immediately open confirmation dialog if so)
        formik.handleSubmit();
        /*
        const sheetFrame = document.querySelector('iframe');
        if (sheetFrame && sheetFrame.contentWindow) {
            sheetFrame.width = sheetFrame.contentWindow.document.body.scrollWidth + 'px';
            sheetFrame.height = sheetFrame.contentWindow.document.body.scrollHeight + 'px';
        }
        */
    }, []);

    const handleAcceptClick = () => {
        setSaveDialogOpen(true);
    };

    const handleDiscountCodeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            formik.handleSubmit();
            // prevent form submission
            event.preventDefault();
        }
    };

    const handleDiscountCodeBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        formik.handleSubmit();
    };

    const handleSaveDialogTransitionEnter = () => {
        // render Checkout component now that dialog DOM exists
        setSaveDialogOpened(true);
    };

    const handleSaveDialogClose = () => {
        setSaveDialogOpened(false);
        setSaveDialogOpen(false);
    };

    const handleCheckoutSuccess = () => {
        mixpanel.track('Checkout success', { notifyTrue: formik.values.notifyParticipants });
        setSaveDialogOpened(false);
        setSaveDialogOpen(false);
        setConfirmDialogOpen(true);

        if (formik.values.notifyParticipants) {
            requestNotifyParticipants();
        }
    }

    const handleCheckoutFailure = () => {
        setSaveDialogOpened(false);
        setSaveDialogOpen(false);
    }

    const handleConfirmDialogClose = () => {
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`;
        window.open(sheetUrl, '_blank');
        window.location.href = '/schedule';
    };

    const handleSaveCancelClick = () => {
        const url = `/api/schedule/${sheetId}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => { })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error);
            })
            .finally(() => {
                window.location.href = '/schedule';
            });
    };

    const requestNotifyParticipants = () => {
        if (publicRuntimeConfig.DEV_FEATURES) {
            const url = `/api/schedule/${sheetId}/notify`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            })
                .then(() => { })
                .catch(error => {
                    // Handle errors here
                    console.error('Error:', error);
                });
        }
    }

    const previewUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview?storage_access_granted=true`;

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
                    <Grid container xs={12} md={8}>
                        <Grid xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
                            <h3>Here is a preview of your schedule</h3>
                        </Grid>
                        <Grid xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
                            <Button
                                variant='outlined'
                                type="submit"
                                color="secondary"
                                onClick={handleSaveCancelClick}
                                css={{
                                    marginRight: 16,
                                    [mq.xl]: {
                                        marginRight: 24,
                                    }
                                }}
                            >cancel</Button>
                            <Button
                                variant='contained'
                                type="submit"
                                color="secondary"
                                onClick={handleAcceptClick}
                            >accept</Button>
                        </Grid>
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
            <Dialog id="saveDialog"
                onClose={handleSaveDialogClose}
                open={saveDialogOpen}
                onTransitionEnter={handleSaveDialogTransitionEnter}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {`Get Your Schedule for $1`}
                </DialogTitle>
                <div css={{ padding: 16 }}>
                    <div css={{ paddingBottom: 16 }}>
                        <TextField name="discountCode"
                            id="discountCode"
                            label="Discount Code"
                            type={"text"}
                            helperText={discountCodeHelperText}
                            value={formik.values.discountCode}
                            onChange={formik.handleChange}
                            onBlur={handleDiscountCodeBlur}
                            onKeyDown={handleDiscountCodeKeyDown}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div css={{ paddingBottom: 16 }}>
                        <FormGroup>
                            <Tooltip title="share the schedule with its participants">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="notifyParticipants"
                                            name="notifyParticipants"
                                            checked={formik.values.notifyParticipants}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                formik.setFieldValue('notifyParticipants', event.target.checked);
                                                formik.handleSubmit();
                                            }}
                                            onBlur={formik.handleBlur} />}
                                    label="Notify participants" />
                            </Tooltip>
                        </FormGroup>
                    </div>
                    {saveDialogOpened ? <Checkout onSuccess={handleCheckoutSuccess} onFailure={handleCheckoutFailure} clientId={paymentClientId} /> : null}
                </div>
            </Dialog>
            <Dialog id="confirmDialog" onClose={handleConfirmDialogClose} open={confirmDialogOpen}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Thanks for using Activisor</DialogTitle>
                <DialogContent dividers={true} sx={{ m: 0, p: 2 }}>
                    <p>We&apos;ve added your schedule as a Google Sheets file named&nbsp;
                        <span css={{
                            color: theme.palette.primary.dark,
                            fontWeight: 'bold',
                        }}>{scheduleData?.scheduleName}</span>
                        &nbsp;to your Google Drive&apos;s root folder.</p>

                </DialogContent>
                <div css={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 16,
                }}>
                    <Button
                        variant='contained'
                        type="submit"
                        color="secondary"
                        onClick={handleConfirmDialogClose}
                    >Open Schedule</Button>
                </div>
            </Dialog>
        </main>
    );
}