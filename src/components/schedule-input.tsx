/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { signIn } from 'next-auth/react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import FormikMuiDatePicker from '@/components/formik-mui-date-picker';
import ParticipantInput, { ParticipantInputProps, ADD_EVENT, CHANGE_EVENT, DELETE_EVENT } from './participant-input';
import Frequency from '@/lib/frequency';
import type { ScheduleData } from '@/lib/schedule-data';
import { subscribe } from '@/client-lib/events';
import { saveItem, hasStorage, GENERATION_REQUESTED, SCHEDULE_DATA } from '@/client-lib/local-storage';

const twoColumnChild = css`
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    height: 100%;
    & > * {
        margin: 8px;
    }
`;

const forceInt = (value: any): any => {
    if (typeof value === 'string') {
        return parseInt(value);
    }
    return value;
}

const scheduleSchema = yup.object({
    //participants: yup.array(),//.min(yup.ref('groupSize'), 'Must have at least as many participants as group size'),
    scheduleName: yup.string()
        .min(2, 'must be at least 2 characters long')
        .required('Required'),
    startDate: yup.date(),
    endDate: yup.date()
        .min(yup.ref('startDate'), "Start date can't be after end date"),
    groupSize: yup.number().transform(forceInt),
    frequency: yup.number().transform(forceInt)
});

const ScheduleInput: React.FC = () => {
    const initialParticipants: ParticipantInputProps[] = [];
    const [participants, setParticipants] = useState(initialParticipants);
    const [participantKey, setParticipantKey] = useState(0);

    const handleAddParticipant = (event: CustomEvent) => {
        setParticipantKey(participantKey + 1);

        const participant: ParticipantInputProps = {
            ...event.detail,
            saved: true,
            id: participantKey
        };

        setParticipants([...participants, participant]);
    }

    const handleChangeParticipant = (event: CustomEvent) => {
        const index = participants.findIndex((participant) => {
            return (participant.id === event.detail.id);
        });

        if (index >= 0 && participants && participants[index]) {
            participants[index].name = event.detail.name;
            participants[index].email = event.detail.email;
            setParticipants(participants);
        }
    }

    const handleDeleteParticipant = (event: CustomEvent) => {
        let tempParticipants: ParticipantInputProps[] = participants.filter((participant) => {
            return participant.id !== event.detail.id;
        });
        setParticipants(tempParticipants);
    }

    const renderParticipants = () => {
        return participants.map((participant, index) => {
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
    }

    useEffect(() => {
        subscribe(ADD_EVENT, handleAddParticipant);
        subscribe(CHANGE_EVENT, handleChangeParticipant);
        subscribe(DELETE_EVENT, handleDeleteParticipant);
    });

    return (
        <Formik
            initialValues={{
                scheduleName: '',
                //participants: participants,
                groupSize: 1,
                frequency: Frequency.Weekly,
                startDate: new Date(),
                endDate: new Date()
            }}
            validationSchema={scheduleSchema}
            onSubmit={(values) => {
                console.log('create schedule');

                if (hasStorage()) {
                    const scheduleData: ScheduleData = {
                        participants: participants,
                        scheduleName: values.scheduleName,
                        startDate: values.startDate,
                        endDate: values.endDate,
                        groupSize: forceInt(values.groupSize),
                        frequency: forceInt(values.frequency)
                    };
                    saveItem(SCHEDULE_DATA, scheduleData);
                    saveItem(GENERATION_REQUESTED, false);

                    // Nextauth OpenID Connect
                    signIn('google');
                } else {
                    alert('You must enable Local Storage to allow Activisor to build your schedule.');
                }
            }}
        >
            {props => (
                <Form>
                    <div id="container" css={{
                        /* breakpoint for large screen overrides, 1280px wide */
                        '@media(min-width: 1248px)': {
                            display: 'flex',
                            alignItems: 'flex-start',
                        }
                    }}>
                        <div css={css`
                        ${twoColumnChild};
                    `}>
                            <div>
                                <TextField
                                    id="scheduleName"
                                    label="Schedule Name"
                                    name="scheduleName"
                                    type="text"
                                    inputProps={{autoFocus: true}}
                                    value={props.values.scheduleName}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    onKeyDown={(event) => {if (event.key === 'Enter') { event.preventDefault(); }}}
                                    error={props.touched.scheduleName && Boolean(props.errors.scheduleName)}
                                    helperText={props.touched.scheduleName && props.errors.scheduleName}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div>
                                <FormikMuiDatePicker
                                    name="startDate"
                                    label="Start on"
                                    css={{ marginRight: 8 }}
                                />
                                <FormikMuiDatePicker name="endDate" label="End by" />
                            </div>
                            <div>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel id="size-select-label">Group Size</InputLabel>
                                    <Select
                                        labelId="size-select-label"
                                        id="groupSize"
                                        name="groupSize"
                                        label="Group Size"
                                        value={props.values.groupSize.toString()}
                                        onChange={props.handleChange}
                                    >
                                        <MenuItem value="1">1 member</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                        <MenuItem value="6">6</MenuItem>
                                        <MenuItem value="7">7</MenuItem>
                                        <MenuItem value="8">8</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel id="frequency-select-label">Frequency</InputLabel>
                                    <Select
                                        labelId="frequency-select-label"
                                        id="frequency"
                                        name="frequency"
                                        label="Frequency"
                                        value={props.values.frequency.toString()}
                                        onChange={props.handleChange}
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
                        </div>

                        <div css={css`
                            ${twoColumnChild};
                        `}>
                            <h2>Participants</h2>
                            <div id="existing-participants" css={{
                                '& > *': {
                                    marginBottom: 8,
                                }
                            }}>
                                {renderParticipants()}
                            </div>
                            <h3 css={{
                                marginTop: 16
                            }}>Add</h3>
                            <ParticipantInput name="" email="" saved={false} />
                        </div>
                    </div>
                    <div css={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 16
                    }}>
                        <Button variant="contained" type="submit">Create Schedule</Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default ScheduleInput;