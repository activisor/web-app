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
    const [price, setPrice] = useState(publicRuntimeConfig.BASE_PRICE_CENTS);
    const [referral, setReferral] = useState(false);
    const [referralDiscount, setReferralDiscount] = useState(0);
    const [discountCodeHelperText, setDiscountCodeHelperText] = useState('');

    const theme = useTheme();
    const altTextColorCss = css({
        color: theme.palette.primary.dark,
    });

    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency ?? 'USD',
    });

    const discountSchema = yup.object({
        referral1: yup.string().email('Invalid email address'),
        referral2: yup.string().email('Invalid email address'),
        discountCode: yup.string(),
        notifyParticipants: yup.boolean(),
    });

    const formik = useFormik({
        initialValues: {
            referral1: '',
            referral2: '',
            discountCode: '',
            notifyParticipants: true
        },

        validationSchema: discountSchema,

        onSubmit: values => {
            // make API call to validate discount code
            const url = `/api/code-validation?code=${values.discountCode}&referral=${referral}&currency=${currency}`;
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
                        transitionToConfirmDialog();
                    } else {
                        if (values.discountCode) {
                            setDiscountCodeHelperText('Invalid discount code');
                        }
                        setPaymentClientId(data.paymentClientId);
                        setCurrency(data.currency);
                        setPrice(data.priceCents);
                        setReferralDiscount(data.referralDiscount);
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

    const setReferralState = (field: string): void => {
        formik.validateField(field);
        if (formik.values.referral1 && !Boolean(formik.errors.referral1)
            && formik.values.referral2 && !Boolean(formik.errors.referral2)) {
            setReferral(true);
            formik.handleSubmit();
        } else {
            setReferral(false);
        }
    }

    const handleReferralBlur = (event: React.FocusEvent<HTMLInputElement>, field: string): void => {
        formik.setFieldValue(field, event.target.value);

        setReferralState(field);
    }

    const handleReferralKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, field: string): void => {
        if (event.key === 'Enter') {
            const emailInput = event.target as HTMLInputElement;
            emailInput.blur();

            setReferralState(field);

            // prevent spurious form submission
            event.preventDefault();
        }
    }

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
        transitionToConfirmDialog();
    }

    const transitionToConfirmDialog = () => {
        handleSaveDialogClose();
        setConfirmDialogOpen(true);

        if (referral) {
            mixpanel.track('Referral', { referral1: formik.values.referral1, referral2: formik.values.referral2 });
            requestEmailReferrals([formik.values.referral1, formik.values.referral2]);
        }
    }

    const handleConfirmDialogClose = () => {
        if (formik.values.notifyParticipants) {
            requestNotifyParticipants();
        }

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

    const requestEmailReferrals = (emails: string[]) => {
        const url = `/api/mail-relay/referrals`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emails),
        })
            .then(() => { })
            .catch(error => {
                // Handle errors here
                console.error('Error:', error);
            });
    }

    const previewUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview?storage_access_granted=true`;

    return (
        <main css={{backgroundColor: '#FFFFFF'}}>
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
                            <h3 css={ altTextColorCss }>Here is a preview of your schedule</h3>
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
                <DialogTitle>
                    Get Your Schedule
                </DialogTitle>
                <DialogContent dividers={true}>
                    <p css={{ fontWeight: '700' }}>
                        {`Your cost: ${USDollar.format(price / 100)}`}
                    </p>
                    {
                        publicRuntimeConfig.DEV_FEATURES
                            ? <div css={{ marginBottom: 16 }}>
                                <p>{`Refer two friends for ${referralDiscount}% off`}</p>
                                <div css={{ marginBottom: 16 }}>
                                    <TextField name="referral1"
                                        id="referral1"
                                        type={"email"}
                                        inputProps={{ placeholder: 'Email', value: formik.values.referral1 }}
                                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                                            handleReferralBlur(event, 'referral1');
                                        }}
                                        onChange={formik.handleChange}
                                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                            handleReferralKeyDown(event, 'referral1');
                                        }}
                                        error={formik.touched.referral1 && Boolean(formik.errors.referral1)}
                                        helperText={formik.touched.referral1 && formik.errors.referral1} />
                                </div>
                                <div>
                                    <TextField name="referral2"
                                        id="referral2"
                                        type={"email"}
                                        inputProps={{ placeholder: 'Email', value: formik.values.referral2 }}
                                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                                            handleReferralBlur(event, 'referral2');
                                        }}
                                        onChange={formik.handleChange}
                                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                            handleReferralKeyDown(event, 'referral2');
                                        }}
                                        error={formik.touched.referral2 && Boolean(formik.errors.referral2)}
                                        helperText={formik.touched.referral2 && formik.errors.referral2} />
                                </div>
                            </div>
                            : null
                    }
                    <div>
                        <div css={{
                            paddingTop: 16,
                            paddingBottom: 24,
                        }}>
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
                        {saveDialogOpened ? <Checkout onSuccess={handleCheckoutSuccess} onFailure={handleSaveDialogClose} clientId={paymentClientId} referral={referral} /> : null}
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog id="confirmDialog" onClose={handleConfirmDialogClose} open={confirmDialogOpen}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Thanks for using Activisor</DialogTitle>
                <DialogContent dividers={true} sx={{ m: 0, p: 2 }}>
                    <p>We&apos;ve added your schedule as a Google Sheets file named&nbsp;
                        <span css={[ altTextColorCss, {
                            fontWeight: 'bold',
                        }]}>{scheduleData?.scheduleName}</span>
                        &nbsp;to your Google Drive&apos;s root folder.</p>
                    <div css={{ paddingBottom: 16 }}>
                        <FormGroup>
                            <Tooltip title="share the schedule with participants">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="notifyParticipants"
                                            name="notifyParticipants"
                                            checked={formik.values.notifyParticipants}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                formik.setFieldValue('notifyParticipants', event.target.checked);
                                            }} />}
                                    label="Notify participants" />
                            </Tooltip>
                        </FormGroup>
                    </div>
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