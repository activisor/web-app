/** @jsxImportSource @emotion/react */
'use client'

// import { css } from '@emotion/react'
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton/IconButton';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { publish } from '@/client-lib/events';
import type { Participant } from '@/lib/participant';

export interface ParticipantInputProps extends Participant {
    saved: boolean;
}

export const ADD_EVENT = 'activisor:add-participant';
export const CHANGE_EVENT = 'activisor:change-participant';
export const DELETE_EVENT = 'activisor:delete-participant';

const emailSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Required')
});

const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const [props_, setProps_] = useState(props);

    const formik = useFormik({
        initialValues: {
          email: '',
        },

        validationSchema: emailSchema,

        onSubmit: values => {},
     });

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.email = event.target.value;
        setProps_(tempProps);
        formik.handleChange(event);
        if (props_.saved) {
            formik.validateField('email');
            if (!Boolean(formik.errors.email)) {
                publish(CHANGE_EVENT, tempProps);
            }
        }
    };

    const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter' && props_.saved) {
            // event.preventDefault();
            formik.validateField('email');
            if (!Boolean(formik.errors.email)) {
                publish(CHANGE_EVENT, props_);
            }
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.name = event.target.value;
        setProps_(tempProps);
    };

    const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter' && props_.saved) {
            formik.validateField('email');
            if (!Boolean(formik.errors.email)) {
                publish(CHANGE_EVENT, props_);
            }
        } else if (event.key === 'Enter' && props_.email && props_.name) {
            formik.validateField('email');
            if (!Boolean(formik.errors.email)) {
                publish(ADD_EVENT, props_);
                const initialProps: ParticipantInputProps = {
                    name: '',
                    email: '',
                    saved: false
                };
                setProps_(initialProps);
            }
        }
    }

    const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        formik.validateField('email');
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
            <TextField name="email"
                id="participant-email"
                type={"email"}
                required
                inputProps={{ placeholder: 'Email', value: props_.email }}
                onBlur={formik.handleBlur}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                css={{ marginRight: 8 }} />
            <TextField name="name"
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
                <IconButton
                    aria-label="add"
                    color="primary"
                    onClick={handleAddClick}
                    disabled={!Boolean(props_.email) || Boolean(formik.errors.email)}
                >
                    <AddIcon />
                </IconButton>
            )}
        </div>
    );
}

export default ParticipantInput;