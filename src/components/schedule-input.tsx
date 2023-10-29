'use client'

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ParticipantInput, { ParticipantInputProps, ADD_EVENT, CHANGE_EVENT, DELETE_EVENT } from '../components/participant-input';
import { subscribe } from '../client-utilities/events';

function handleChange(event: SelectChangeEvent) {
  console.log(event.target.value);
}

const ScheduleInput: React.FC = () => {
  const initialParticipants : ParticipantInputProps[] = [];
  const [participants, setParticipants] = useState(initialParticipants);
  const scheduleInputProps = {
    placeholder: 'Schedule Name',
    required: true,
    autoFocus: true
  };

  const handleAddParticipant = (event : CustomEvent) => {
    let tempParticipants : ParticipantInputProps[] = [...participants];
    event.detail.saved = true;
    tempParticipants.push(event.detail);
    setParticipants(tempParticipants);
  }

  const handleChangeParticipant = (event : CustomEvent) => {
    let tempParticipants : ParticipantInputProps[] = [...participants];
    const index = tempParticipants.findIndex((participant) => {
      return (participant.name === event.detail.name) || (participant.email === event.detail.email);
    });
    tempParticipants[index].name = event.detail.name;
    tempParticipants[index].email = event.detail.email;
    setParticipants(tempParticipants);
   }

  const handleDeleteParticipant = (event : CustomEvent) => {
    let tempParticipants : ParticipantInputProps[] = [...participants];
    tempParticipants = tempParticipants.filter((participant) => {
      return participant.email !== event.detail.email;
    });
    setParticipants(tempParticipants);
  }

  useEffect(() => {
    subscribe(ADD_EVENT, handleAddParticipant);
    subscribe(CHANGE_EVENT, handleChangeParticipant);
    subscribe(DELETE_EVENT, handleDeleteParticipant);
  });

  const renderParticipants = () => {
    return participants.map((participant, index) => {
      return (
        <ParticipantInput
          key={index}
          name={participant.name}
          email={participant.email}
          saved={participant.saved}
        />
      )
    });
  }

  return (
    <div>
      <div id="container" className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div>
          <TextField id="schedule-name" type="text" inputProps={scheduleInputProps} />
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start on" />
            <DatePicker label="End by" />
          </LocalizationProvider>
        </div>
        <div>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="size-select-label">Group Size</InputLabel>
            <Select
              labelId="size-select-label"
              id="size-select"
              label="Group Size"
              value="1"
              onChange={handleChange}
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
              value="1"
              onChange={handleChange}
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
        <ParticipantInput name="" email="" saved={false}/>
      </div>
      <div>
        <Button variant="contained">Create Schedule</Button>
      </div>
    </div>
  )
}

export default ScheduleInput;