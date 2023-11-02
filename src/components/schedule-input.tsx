'use client'

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SessionProvider } from 'next-auth/react';
import ParticipantInput, { ParticipantInputProps, ADD_EVENT, CHANGE_EVENT, DELETE_EVENT } from '../components/participant-input';
import Frequency from '../lib/frequency';
import { subscribe } from '../client-lib/events';

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
    event.detail.saved = true;
    event.detail.id = participantKey;
    setParticipantKey(participantKey + 1);

    setParticipants([...participants, event.detail]);
  }

  const handleChangeParticipant = (event: CustomEvent) => {
    const index = participants.findIndex((participant) => {
      return (participant.id === event.detail.id);
    });

    if (index >= 0) {
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

    // bundle payload into state and start OAuth flow
    /*
    fetch('YOUR_API_ENDPOINT', {
      method: 'POST', // or 'GET' or any other HTTP method
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participants: participants,
        scheduleName: scheduleName,
        startDate: startDate,
        endDate: endDate,
        groupSize: groupSize,
        frequency: frequency
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle API response data here
        console.log(data);
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
      */
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
    <div>
      <div id="container" className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div>
          <TextField id="schedule-name" type="text" inputProps={scheduleInputProps} onChange={handleScheduleNameChange} />
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start on" onChange={onStartDateChange} />
            <DatePicker label="End by" onChange={onEndByChange} />
          </LocalizationProvider>
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
              <MenuItem value="3">monthly</MenuItem>
              <MenuItem value="4">every weekday</MenuItem>
              <MenuItem value="5">custom</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div>
        <h2>Participants</h2>
        <div id="existing-participants">
          {renderParticipants()}
        </div>
        <h3>Add another</h3>
        <ParticipantInput name="" email="" saved={false} />
      </div>
      <div>
        <Button variant="contained" onClick={handleCreateClick}>Create Schedule</Button>
      </div>
    </div>
  );
}

export default ScheduleInput;