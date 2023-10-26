'use client'

import React from 'react';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton/IconButton';

export interface ParticipantInputProps {
    name: string;
    email: string;
    saved: boolean;
}

const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const participantNameInputProps = {
        placeholder: 'Name',
        value: props.name
    };

    const participantEmailInputProps = {
        placeholder: 'Email',
        value: props.email
    };

    return (
        <div className="flex items-center justify-between p-4">
            <TextField id="participant-email" type="text" inputProps={participantEmailInputProps} />
            <TextField id="participant-name" type="text" inputProps={participantNameInputProps} />
            {props.saved ? (
                <IconButton aria-label="delete" color="primary">
                    <DeleteIcon />
                </IconButton>
            ) : (
                <IconButton aria-label="add" color="primary">
                    <AddIcon />
                </IconButton>
            )}
        </div>
    );
}

export default ParticipantInput;