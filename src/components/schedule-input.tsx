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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import * as yup from 'yup';

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

const scheduleSchema = yup.object({
    participants: yup.array(),
    scheduleName: yup.string()
        .min(2, 'must be at least 2 characters long')
        .required('Required'),
    startDate: yup.date().required('Required'),
    endDate: yup.date()
        .min(yup.ref('startDate'), 'End date must be after start date')
        .required('Required'),
});


const ScheduleInput: React.FC = () => {
    const initialParticipants: ParticipantInputProps[] = [];
    const [participants, setParticipants] = useState(initialParticipants);
    const [participantKey, setParticipantKey] = useState(0);

    const [scheduleName, setScheduleName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [groupSize, setGroupSize] = useState(1); // [1, 2, 3, 4, 5, 6, 7, 8]
    const [frequency, setFrequency] = useState(Frequency.Weekly);

    const scheduleInputProps = {
        placeholder: 'Schedule Name',
        required: true,
        autoFocus: true
    };

    const handleScheduleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setScheduleName(event.target.value);
    }

    const onStartDateChange = (date: Date | null) => {
        if (date) {
            setStartDate(date);
        }
    }

    const onEndByChange = (date: Date | null) => {
        if (date) {
            setEndDate(date);
        }
    }

    const handleAddParticipant = (event: CustomEvent) => {
        const participant: ParticipantInputProps = {
            ...event.detail,
            saved: true,
            id: participantKey};
        setParticipantKey(participantKey + 1);

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

    const handleGroupSizeChange = (event: SelectChangeEvent) => {
        setGroupSize(parseInt(event.target.value));
        console.log(event.target.value);
    }

    const handleFrequencyChange = (event: SelectChangeEvent) => {
        setFrequency(parseInt(event.target.value));
        console.log(event.target.value);
    }

    const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        console.log('create schedule');

        if (hasStorage()) {
            const scheduleData: ScheduleData = {
                participants: participants,
                scheduleName: scheduleName,
                startDate: startDate,
                endDate: endDate,
                groupSize: groupSize,
                frequency: frequency
            };
            saveItem(SCHEDULE_DATA, scheduleData);
            saveItem(GENERATION_REQUESTED, false);

            // Nextauth OpenID Connect
            signIn('google');
        } else {
            alert('You must enable Local Storage to allow Activisor to build your schedule.');
        }
    };

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
        <form>
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
                        <TextField id="scheduleName" type="text" inputProps={scheduleInputProps} onChange={handleScheduleNameChange} />
                    </div>
                    <div>
                        <DatePicker label="Start on" onChange={onStartDateChange} css={{ marginRight: 8}}/>
                        <DatePicker label="End by" onChange={onEndByChange} />
                    </div>
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="size-select-label">Group Size</InputLabel>
                            <Select
                                labelId="size-select-label"
                                id="size-select"
                                label="Group Size"
                                value={groupSize.toString()}
                                onChange={handleGroupSizeChange}
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
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="frequency-select-label">Frequency</InputLabel>
                            <Select
                                labelId="frequency-select-label"
                                id="frequency-select"
                                label="Frequency"
                                value={frequency.toString()}
                                onChange={handleFrequencyChange}
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
                <Button variant="contained" onClick={handleCreateClick}>Create Schedule</Button>
            </div>
        </form>
    );
}

export default ScheduleInput;