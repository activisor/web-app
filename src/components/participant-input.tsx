'use client'

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton/IconButton';
import { publish } from '@/client-utilities/events';

export interface ParticipantInputProps {
    name: string;
    email: string;
    saved: boolean;
}

export const ADD_EVENT = 'activisor:add-participant';
export const CHANGE_EVENT = 'activisor:change-participant';
export const DELETE_EVENT = 'activisor:delete-participant';

const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const [props_, setProps_] = useState(props);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        let tempProps = { ...props_ };
        tempProps.email = event.target.value;
        setProps_(tempProps);
        if (props_.saved) {
            publish(CHANGE_EVENT, props_);
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        let tempProps = { ...props_ };
        tempProps.name = event.target.value;
        setProps_(tempProps);
        if (props_.saved) {
            publish(CHANGE_EVENT, props_);
        }
    };

    const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) : void => {
        publish(ADD_EVENT, props_);
        let tempProps = { ...props_ };
        tempProps.email = '';
        tempProps.name = '';
        setProps_(tempProps);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) : void => {
        publish(DELETE_EVENT, props_);
        alert('deleted');
    };

    return (
        <div className="flex items-center justify-between p-4">
            <TextField id="participant-email" type="text" inputProps={{placeholder: 'Email', value: props_.email}} onChange={handleEmailChange} />
            <TextField id="participant-name" type="text" inputProps={{placeholder: 'Name', value: props_.name}} onChange={handleNameChange} />
            {props.saved ? (
                <IconButton aria-label="delete" color="primary" onClick={handleDeleteClick}>
                    <DeleteIcon />
                </IconButton>
            ) : (
                <IconButton aria-label="add" color="primary" onClick={handleAddClick}>
                    <AddIcon />
                </IconButton>
            )}
        </div>
    );
}

export default ParticipantInput;