/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import Close from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from '@mui/material/styles';

import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

import FormikMuiDatePicker from '@/components/formik-mui-date-picker';
import ParticipantInput, { type SavedParticipant } from './participant-input';
import { publicRuntimeConfig } from '@/lib/app-constants';
import { toDaysArray, toDaysOfWeek, orderedDaysArray } from '@/lib/days-of-week-convert';
import Frequency from '@/lib/frequency';
import type { Participant } from '@/lib/participant';
import type { ScheduleData } from '@/lib/schedule-data';
import { readItem, saveItem, hasStorage, SCHEDULE_DATA } from '@/client-lib/local-storage';
import { mq } from '@/lib/media-queries';

const twoColumnChild = css({
    margin: 8,
    '& > *': {
        margin: 8
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

const toSavedParticipant = (participant: Participant): SavedParticipant => {
    return { ...participant, saved: true };
};

const scheduleSchema = yup.object({
    participants: yup.array<SavedParticipant>()
        .min(yup.ref('groupSize'), 'Not enough participants for this size group'),
    scheduleName: yup.string()
        .min(2, 'must be at least 2 characters long')
        .required('Required'),
    startDate: yup.date(),
    endDate: yup.date()
        .min(yup.ref('startDate'), "End date must be after start date"),
    groupSize: yup.number().transform(forceInt),
    frequency: yup.number().transform(forceInt),
    daysOfWeek: yup.array().min(1, 'Select at least one day of the week'),
    total: yup.number()
});

export interface ScheduleInputProps {
    handleSubmit: () => void;
};

const ScheduleInput: React.FC<ScheduleInputProps> = (props) => {
    const sizeLabel = 'Group Size';
    const frequencyLabel = 'Meeting';

    // alert the user once they have 8 participants if group size is still 1
    const participantNotificationNumber = 7;

    const theme = useTheme();
    const altTextColorCss = css({
        color: theme.palette.primary.dark,
    });

    const initialParticipants: SavedParticipant[] = [];
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // has been opened at least once
    const [snackbarOpened, setSnackbarOpened] = useState(false);
    const [daysDialogOpen, setDaysDialogOpen] = useState(false);

    const defaultDate = today();
    const defaultDaysOfWeek = orderedDaysArray();
    const initialDaysOfWeek = [defaultDaysOfWeek[defaultDate.getDay()]];

    const formikProps = useFormik({
        initialValues: {
            scheduleName: '',
            participants: initialParticipants,
            groupSize: 1,
            frequency: Frequency.Monthly,
            startDate: defaultDate,
            endDate: defaultDate,
            daysOfWeek: initialDaysOfWeek,
            total: 0
        },

        validationSchema: scheduleSchema,

        onSubmit: (values) => {
            console.log('creating schedule');

            if (hasStorage()) {
                const scheduleData: ScheduleData = {
                    participants: values.participants,
                    scheduleName: values.scheduleName,
                    groupSize: forceInt(values.groupSize),
                    totalCost: Number(values.total),
                    dates: {
                        startDate: values.startDate,
                        endDate: values.endDate,
                        frequency: forceInt(values.frequency),
                        daysOfWeek: toDaysOfWeek(values.daysOfWeek),
                    }
                };
                saveItem(SCHEDULE_DATA, scheduleData);
                props.handleSubmit();

            } else {
                alert('You must enable Local Storage to allow Activisor to build your schedule.');
            }
        },
    });

    const handleStartDayChange = (date: Date, day: number) => {
        // update day of week if single day selected
        if (formikProps.values.daysOfWeek.length === 1) {
            formikProps.setFieldValue('daysOfWeek', [defaultDaysOfWeek[day]]);
        }

        // shift end date if start date is after end date
        if (formikProps.values.endDate < date) {
            formikProps.setFieldValue('endDate', date);
        }
    };

    const handleDaysOfWeekClick = () => {
        setDaysDialogOpen(true);
    };

    const handleChangeFrequency = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        const frequency = forceInt(event.target.value);
        formikProps.setFieldValue('frequency', frequency);
    };

    const handleDaysOfWeekChange = (
        event: React.MouseEvent<HTMLElement>,
        newDaysOfWeek: [],
    ) => {
        if (newDaysOfWeek.length) {
            formikProps.setFieldValue('daysOfWeek', newDaysOfWeek);
        }
    };

    const handleAddParticipant = (participant: SavedParticipant) => {
        participant.saved = true;
        participant.id = Date.now();

        const participants = [...formikProps.values.participants];
        formikProps.setFieldValue('participants', [...participants, participant]);

        // if many participants and group size is still 1, open snackbar notice
        if (!snackbarOpened && (formikProps.values.groupSize === 1) && (participants.length === participantNotificationNumber)) {
            setOpenSnackbar(true);
            setSnackbarOpened(true);
        }
    };

    const handleChangeParticipant = (participant: SavedParticipant) => {
        const participants = [...formikProps.values.participants];
        const index = participants.findIndex((item) => {
            return (item.id === participant.id);
        });

        if (index >= 0 && participants && participants[index]) {
            participants[index].name = participant.name;
            participants[index].email = participant.email;
            participants[index].isHalfShare = participant.isHalfShare;

            formikProps.setFieldValue('participants', participants);
        }
    };

    const handleDeleteParticipant = (participant: SavedParticipant) => {
        const tempParticipants: SavedParticipant[] = formikProps.values.participants.filter((saved) => {
            return saved.id !== participant.id;
        });
        formikProps.setFieldValue('participants', tempParticipants);
    };

    const renderParticipants = () => {
        return formikProps.values.participants.map((participant, index) => {
            return (
                <ParticipantInput
                    index={index + 1}
                    key={participant.id}
                    id={participant.id}
                    name={participant.name}
                    email={participant.email}
                    saved={participant.saved}
                    isHalfShare={participant.isHalfShare}
                    handleAdd={handleAddParticipant}
                    handleChange={handleChangeParticipant}
                    handleDelete={handleDeleteParticipant}
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

    const handleDaysDialogClose = () => {
        setDaysDialogOpen(false);
    }

    useEffect(() => {
        // initialize form values from local storage if available and not already changed
        if (hasStorage()) {
            const dto: ScheduleData | null = readItem(SCHEDULE_DATA);
            if (dto && !formikProps.values.scheduleName && !formikProps.values.participants.length) {
                formikProps.setFieldValue('scheduleName', dto.scheduleName);
                formikProps.setFieldValue('participants', dto.participants.map(toSavedParticipant));

                if (dto.groupSize) {
                    formikProps.setFieldValue('groupSize', dto.groupSize);
                }
                if (dto.totalCost) {
                    formikProps.setFieldValue('total', dto.totalCost);
                }
                if (dto.dates) {
                    if (dto.dates.startDate) {
                        formikProps.setFieldValue('startDate', new Date(dto.dates.startDate));
                    }
                    if (dto.dates.endDate) {
                        formikProps.setFieldValue('endDate', new Date(dto.dates.endDate));
                    }
                    if (dto.dates.frequency) {
                        formikProps.setFieldValue('frequency', dto.dates.frequency);
                    }
                    if (dto.dates.daysOfWeek) {
                        formikProps.setFieldValue('daysOfWeek', toDaysArray(dto.dates.daysOfWeek));
                    }
                }
            }
        }
    }, []);

    const allowAddParticipants = formikProps.values.participants.length < publicRuntimeConfig.MAX_PARTICIPANTS;

    const snackbarAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="primary"
                onClick={handleCloseSnackbar}
            >
                <Close fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const daysOfWeekText = `${formikProps.values.daysOfWeek.length} day${formikProps.values.daysOfWeek.length > 1 ? 's' : ''} a week`;
    const weeklyDailyMenuTitle = formikProps.values.frequency === Frequency.DaysOfWeek ? daysOfWeekText : 'weekly or daily';

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
                        <div css={[twoColumnChild, {
                            '& > *': {
                                marginBottom: 16
                            },
                        }]}>
                            <h2 css={[altTextColorCss, {
                                marginTop: 8,
                                marginBottom: 8
                            }]}>Schedule</h2>
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
                                    sx={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div css={{
                                display: 'flex'
                            }}>
                                <FormikMuiDatePicker
                                    name="startDate"
                                    label="Starts on"
                                    handleChange={handleStartDayChange}
                                    css={{
                                        marginRight: 8,
                                        '@media(min-width: 1248px)': {
                                            marginRight: 24
                                        }
                                    }}
                                />
                                <FormikMuiDatePicker
                                    name="endDate"
                                    label="Ends by"
                                    handleChange={(date) => { }}
                                />
                            </div>
                            <ErrorMessage component="div" name="endDate" className="text-error" />
                            <div css={{
                                display: 'flex'
                            }}>
                                <div css={{
                                    flexGrow: 1,
                                }}>
                                    <FormControl sx={{ minWidth: 150 }} css={{
                                        marginRight: 8,
                                        '@media(min-width: 1248px)': {
                                            marginRight: 24
                                        }
                                    }}>
                                        <InputLabel id="size-select-label">{sizeLabel}</InputLabel>
                                        <Select
                                            labelId="size-select-label"
                                            id="groupSize"
                                            name="groupSize"
                                            label={sizeLabel}
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
                                </div>
                                <div css={{
                                    flexGrow: 1,
                                }}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="frequency-select-label">{frequencyLabel}</InputLabel>
                                        <Select
                                            labelId="frequency-select-label"
                                            id="frequency"
                                            name="frequency"
                                            label={frequencyLabel}
                                            value={formikProps.values.frequency.toString()}
                                            onChange={handleChangeFrequency}
                                        >
                                            <MenuItem value="4">monthly</MenuItem>
                                            <MenuItem value="3">every other week</MenuItem>
                                            <MenuItem value="5" onClick={handleDaysOfWeekClick}>{weeklyDailyMenuTitle}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div>
                                <TextField
                                    id="total"
                                    label="Overall Cost"
                                    name="total"
                                    type="text"
                                    sx={{ width: 150 }}
                                    value={formikProps.values.total}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); } }}
                                    error={Boolean(formikProps.errors.total)}
                                    helperText={formikProps.errors.total ? 'This must be a number, such as 123.45' : ''}
                                />
                            </div>
                        </div>
                        <div css={css`
                            ${twoColumnChild};
                        `}>
                            <h2 css={[altTextColorCss, {
                                marginTop: 24,
                                /* breakpoint for large screen overrides, 1280px wide */
                                '@media(min-width: 1248px)': {
                                    marginTop: 8
                                }
                            }]}>Members</h2>
                            <div id="existing-participants" css={{
                                '& > *': {
                                    marginBottom: 4,
                                }
                            }}>
                                {renderParticipants()}
                                <ErrorMessage component="div" name="participants" className="text-error" />
                            </div>
                            {allowAddParticipants ? (
                                <div>
                                    <ParticipantInput
                                        index={0}
                                        name=""
                                        email=""
                                        isHalfShare={false}
                                        saved={false}
                                        handleAdd={handleAddParticipant}
                                        handleChange={handleChangeParticipant}
                                        handleDelete={handleDeleteParticipant}
                                    />
                                </div>
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
                            size='large'
                            type="submit"
                            color="secondary"
                        >Create My Google Schedule</Button>
                    </div>
                    <Dialog id="daysDialog" onClose={handleDaysDialogClose} open={daysDialogOpen}>
                        <DialogTitle sx={{ m: 0, p: 2 }}>Days of the Week</DialogTitle>
                        <DialogContent dividers={false} sx={{ m: 0, p: 2 }}>
                            <ToggleButtonGroup
                                color="primary"
                                value={formikProps.values.daysOfWeek}
                                onChange={handleDaysOfWeekChange}
                                aria-label="days of the week"
                            >
                                <ToggleButton value="sun">S</ToggleButton>
                                <ToggleButton value="mon">M</ToggleButton>
                                <ToggleButton value="tue">T</ToggleButton>
                                <ToggleButton value="wed">W</ToggleButton>
                                <ToggleButton value="thu">T</ToggleButton>
                                <ToggleButton value="fri">F</ToggleButton>
                                <ToggleButton value="sat">S</ToggleButton>
                            </ToggleButtonGroup>
                            <p>{daysOfWeekText}</p>
                        </DialogContent>
                        <div css={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: 16,
                        }}>
                            <Button
                                variant='text'
                                color="primary"
                                onClick={handleDaysDialogClose}
                            >OK</Button>
                        </div>
                    </Dialog>
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