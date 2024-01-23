/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

import FormikMuiDatePicker from '@/components/formik-mui-date-picker';
import ParticipantInput, { ParticipantInputProps, ADD_EVENT, CHANGE_EVENT, DELETE_EVENT } from './participant-input';
import { publicRuntimeConfig } from '@/lib/app-constants';
import Frequency from '@/lib/frequency';
import type { Participant } from '@/lib/participant';
import type { ScheduleData } from '@/lib/schedule-data';
import { subscribe } from '@/client-lib/events';
import { readItem, saveItem, hasStorage, SCHEDULE_DATA } from '@/client-lib/local-storage';
import { mq } from '@/lib/media-queries';

const twoColumnChild = css({
    margin: 8,
    '& > *': {
        margin: 16
    },
    '@media(min-width: 1248px)': {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: '100%',
        margin: 8,
        '& > *': {
            margin: 24
        },
    }
});

/**
 * returns a Date object representing today's date with zeroed out time
 */
const today = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
/**
 * converts a string to an integer
 * @param value
 * @returns any
 */
const forceInt = (value: any): any => {
    if (typeof value === 'string') {
        return parseInt(value);
    }
    return value;
};

const toParticipantInputProps = (participant: Participant): ParticipantInputProps => {
    return { ...participant, saved: true };
};

const scheduleSchema = yup.object({
    participants: yup.array<ParticipantInputProps>()
        .min(yup.ref('groupSize'), 'Not enough participants for this size group'),
    scheduleName: yup.string()
        .min(2, 'must be at least 2 characters long')
        .required('Required'),
    startDate: yup.date(),
    endDate: yup.date()
        .min(yup.ref('startDate'), "Start date can't be after end date"),
    groupSize: yup.number().transform(forceInt),
    frequency: yup.number().transform(forceInt),
    total: yup.number()
});

export interface ScheduleInputProps {
    handleSubmit: () => void;
};

const ScheduleInput: React.FC<ScheduleInputProps> = (props) => {
    // alert the user once they have 8 participants if group size is still 1
    const participantNotificationNumber = 7;
    // const theme = useTheme();
    const initialParticipants: ParticipantInputProps[] = [];
    const [participantKey, setParticipantKey] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarOpened, setSnackbarOpened] = useState(false);

    const formikProps = useFormik({
        initialValues: {
            scheduleName: '',
            participants: initialParticipants,
            groupSize: 1,
            frequency: Frequency.Weekly,
            startDate: today(),
            endDate: today(),
            total: 0
        },

        validationSchema: scheduleSchema,

        onSubmit: (values) => {
            console.log('creating schedule');

            if (hasStorage()) {
                const scheduleData: ScheduleData = {
                    participants: values.participants,
                    scheduleName: values.scheduleName,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    groupSize: forceInt(values.groupSize),
                    frequency: forceInt(values.frequency),
                    totalCost: Number(values.total)
                };
                saveItem(SCHEDULE_DATA, scheduleData);
                props.handleSubmit();

            } else {
                alert('You must enable Local Storage to allow Activisor to build your schedule.');
            }
        },
    });

    const handleAddParticipant = (event: CustomEvent) => {
        setParticipantKey(participantKey + 1);

        const participants = [...formikProps.values.participants];
        // if many participants and group size is still 1, open snackbar notice
        if (!snackbarOpened && (formikProps.values.groupSize === 1) && (participants.length === participantNotificationNumber)) {
            setOpenSnackbar(true);
            setSnackbarOpened(true);
        }

        const participant: ParticipantInputProps = {
            ...event.detail,
            saved: true,
            id: participantKey
        };
        formikProps.setFieldValue('participants', [...participants, participant]);
    };

    const handleChangeParticipant = (event: CustomEvent) => {
        const participants = [...formikProps.values.participants];
        const index = participants.findIndex((participant) => {
            return (participant.id === event.detail.id);
        });

        if (index >= 0 && participants && participants[index]) {
            participants[index].name = event.detail.name;
            participants[index].email = event.detail.email;

            formikProps.setFieldValue('participants', participants);
        }
    };

    const handleDeleteParticipant = (event: CustomEvent) => {
        const participants = [...formikProps.values.participants];
        const tempParticipants: ParticipantInputProps[] = participants.filter((participant) => {
            return participant.id !== event.detail.id;
        });
        formikProps.setFieldValue('participants', tempParticipants);
    };

    const renderParticipants = () => {
        return formikProps.values.participants.map((participant, index) => {
            return (
                <ParticipantInput
                    key={participant.id}
                    id={participant.id}
                    name={participant.name}
                    email={participant.email}
                    saved={participant.saved}
                />
            )
        });
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    useEffect(() => {
        subscribe(ADD_EVENT, handleAddParticipant);
        subscribe(CHANGE_EVENT, handleChangeParticipant);
        subscribe(DELETE_EVENT, handleDeleteParticipant);

        // initialize form values from local storage if available and not already changed
        if (hasStorage()) {
            const dto: ScheduleData | null = readItem(SCHEDULE_DATA);
            if (dto && !formikProps.values.scheduleName && !formikProps.values.participants.length) {
                formikProps.setFieldValue('scheduleName', dto.scheduleName);
                formikProps.setFieldValue('participants', dto.participants.map(toParticipantInputProps));

                if (dto.startDate) {
                    formikProps.setFieldValue('startDate', new Date(dto.startDate));
                }
                if (dto.endDate) {
                    formikProps.setFieldValue('endDate', new Date(dto.endDate));
                }
                if (dto.groupSize) {
                    formikProps.setFieldValue('groupSize', dto.groupSize);
                }
                if (dto.frequency) {
                    formikProps.setFieldValue('frequency', dto.frequency);
                }
                if (dto.totalCost) {
                    formikProps.setFieldValue('total', dto.totalCost);
                }

                const lastParticipantKey = dto.participants.length && dto.participants[dto.participants.length - 1].id ? dto.participants[dto.participants.length - 1].id as number : 0;
                setParticipantKey(lastParticipantKey + 1);
            }
        }
    });

    const allowAddParticipants = formikProps.values.participants.length < publicRuntimeConfig.MAX_PARTICIPANTS;

    const snackbarAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <>
            <FormikProvider value={formikProps}>
                <form onSubmit={formikProps.handleSubmit}>
                    <div id="container" css={{
                        /* breakpoint for large screen overrides, 1280px wide */
                        '@media(min-width: 1248px)': {
                            display: 'flex',
                            alignItems: 'flex-start'
                        }
                    }}>
                        <div css={css`${twoColumnChild};`}>
                            <h2 css={{
                                /* breakpoint for large screen overrides, 1280px wide */
                                '@media(min-width: 1248px)': {
                                    marginTop: 8
                                }
                            }}>Schedule</h2>
                            <div>
                                <TextField
                                    id="scheduleName"
                                    label="Schedule Name"
                                    name="scheduleName"
                                    type="text"
                                    inputProps={{ autoFocus: true }}
                                    value={formikProps.values.scheduleName}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); } }}
                                    error={formikProps.touched.scheduleName && Boolean(formikProps.errors.scheduleName)}
                                    helperText={formikProps.touched.scheduleName && formikProps.errors.scheduleName}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div css={{
                                display: 'flex'
                            }}>
                                <FormikMuiDatePicker
                                    name="startDate"
                                    label="Start on"
                                    css={{
                                        marginRight: 8,
                                        '@media(min-width: 1248px)': {
                                            marginRight: 24
                                        }
                                    }}
                                />
                                <FormikMuiDatePicker
                                    name="endDate"
                                    label="End by"
                                />
                            </div>
                            <div>
                                <ErrorMessage name="endDate" />
                            </div>
                            <div css={{
                                display: 'flex'
                            }}>
                                <FormControl sx={{ minWidth: 150 }} css={{
                                    marginRight: 8,
                                    '@media(min-width: 1248px)': {
                                        marginRight: 24
                                    }
                                }}>
                                    <InputLabel id="size-select-label">Group Size</InputLabel>
                                    <Select
                                        labelId="size-select-label"
                                        id="groupSize"
                                        name="groupSize"
                                        label="Group Size"
                                        value={formikProps.values.groupSize.toString()}
                                        onChange={formikProps.handleChange}
                                    >
                                        <MenuItem value="1">1 member</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                        <MenuItem value="6">6</MenuItem>
                                        <MenuItem value="7">7</MenuItem>
                                        <MenuItem value="8">8</MenuItem>
                                        <MenuItem value="9">9</MenuItem>
                                        <MenuItem value="10">10</MenuItem>
                                        <MenuItem value="11">11</MenuItem>
                                        <MenuItem value="12">12</MenuItem>
                                        <MenuItem value="13">13</MenuItem>
                                        <MenuItem value="14">14</MenuItem>
                                        <MenuItem value="15">15</MenuItem>
                                        <MenuItem value="16">16</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel id="frequency-select-label">Frequency</InputLabel>
                                    <Select
                                        labelId="frequency-select-label"
                                        id="frequency"
                                        name="frequency"
                                        label="Frequency"
                                        value={formikProps.values.frequency.toString()}
                                        onChange={formikProps.handleChange}
                                    >
                                        <MenuItem value="1">daily</MenuItem>
                                        <MenuItem value="2">weekly</MenuItem>
                                        <MenuItem value="3">every other week</MenuItem>
                                        <MenuItem value="4">monthly</MenuItem>
                                        <MenuItem value="5">every weekday</MenuItem>
                                        <MenuItem value="6">custom</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <TextField
                                    id="total"
                                    label="Overall Cost"
                                    name="total"
                                    type="text"
                                    value={formikProps.values.total}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); } }}
                                    error={Boolean(formikProps.errors.total)}
                                    helperText={formikProps.errors.total ? 'This must be a number, such as 123.45' : ''}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                        </div>
                        <div css={css`
                            ${twoColumnChild};
                        `}>
                            <h2 css={{
                                marginTop: 24,
                                /* breakpoint for large screen overrides, 1280px wide */
                                '@media(min-width: 1248px)': {
                                    marginTop: 8
                                }
                            }}>Participants</h2>
                            <div id="existing-participants" css={{
                                marginBottom: 8,
                                '& > *': {
                                    marginBottom: 8,
                                }
                            }}>
                                {renderParticipants()}
                                <div>
                                    <ErrorMessage name="participants" />
                                </div>
                            </div>
                            {allowAddParticipants ? (
                                <ParticipantInput name="" email="" saved={false} />
                            ) : (
                                <p>You can have up to {publicRuntimeConfig.MAX_PARTICIPANTS} participants</p>
                            )
                            }
                        </div>
                    </div>
                    <div css={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 16,
                        [mq.md]: {
                            padding: 24,
                        },
                        [mq.xl]: {
                            padding: 32,
                        }
                    }}>
                        <Button
                            variant="contained"
                            type="submit"
                            color="secondary"
                        >Create Schedule</Button>
                    </div>
                </form>
            </FormikProvider>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={10000}
                onClose={handleCloseSnackbar}
                message="Don't forget to adjust your group size."
                action={snackbarAction}
            />
        </>
    );
}

export default ScheduleInput;