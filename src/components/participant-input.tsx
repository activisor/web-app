/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton/IconButton';
import { publish } from '@/client-lib/events';
import type { Participant } from '@/lib/participant';

export interface ParticipantInputProps extends Participant {
    saved: boolean;
}

export const ADD_EVENT = 'activisor:add-participant';
export const CHANGE_EVENT = 'activisor:change-participant';
export const DELETE_EVENT = 'activisor:delete-participant';

const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const [props_, setProps_] = useState(props);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.email = event.target.value;
        setProps_(tempProps);
        if (props_.saved) {
            publish(CHANGE_EVENT, tempProps);
        }
    };

    const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter' && props_.saved) {
            publish(CHANGE_EVENT, props_);
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.name = event.target.value;
        setProps_(tempProps);
    };

    const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter' && props_.saved) {
            publish(CHANGE_EVENT, props_);
        } else if (event.key === 'Enter' && props_.email && props_.name) {
            publish(ADD_EVENT, props_);
            const initialProps: ParticipantInputProps = {
                name: '',
                email: '',
                saved: false
            };
            setProps_(initialProps);
        }
    }

    const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        publish(ADD_EVENT, props_);
        const initialProps: ParticipantInputProps = {
            name: '',
            email: '',
            saved: false
        };
        setProps_(initialProps);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        publish(DELETE_EVENT, props_);
    };

    return (
        <div className="flex items-center justify-between p-4">
            <TextField
                id="participant-email"
                type="text"
                inputProps={{ placeholder: 'Email', value: props_.email }}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown}
                css={{ marginRight: 8 }} />
            <TextField
                id="participant-name"
                type="text"
                inputProps={{ placeholder: 'Name', value: props_.name }}
                onChange={handleNameChange}
                onKeyDown={handleNameKeyDown} />
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