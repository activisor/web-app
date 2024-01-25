/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react';
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
};

export const ADD_EVENT = 'activisor:add-participant';
export const CHANGE_EVENT = 'activisor:change-participant';
export const DELETE_EVENT = 'activisor:delete-participant';

const participantSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Required'),
    name: yup.string(),
});

const participantInputStyle = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const [props_, setProps_] = useState(props);

    const formik = useFormik({
        initialValues: {
            email: props.email,
            name: props.name,
        },

        validationSchema: participantSchema,

        onSubmit: values => { },
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
        if (event.key === 'Enter') {
            if (props_.saved) {
                formik.validateField('email');
                if (!Boolean(formik.errors.email)) {
                    publish(CHANGE_EVENT, props_);
                }
            }

            // change focus to name field
            const emailInput = event.target as HTMLInputElement;
            if (emailInput) {
                emailInput.blur();
                // focused input element is grandchild of TextField root
                const emailTextField = emailInput.parentElement?.parentElement as HTMLDivElement;
                const nameInput = emailTextField.nextElementSibling?.firstElementChild?.firstElementChild as HTMLInputElement;
                nameInput.focus();
            }
            // prevent form submission
            event.preventDefault();
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.name = event.target.value;
        setProps_(tempProps);
    };

    const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            if (props_.saved) {
                formik.validateField('email');
                if (!Boolean(formik.errors.email)) {
                    publish(CHANGE_EVENT, props_);
                    const nameInput = event.target as HTMLInputElement;
                    if (nameInput) {
                        nameInput.blur();
                    }
                }
            } else if (props_.email && props_.name) {
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
            // prevent form submission
            event.preventDefault();
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
        <div css={{
            display: 'flex'
        }}>
            <TextField name="email"
                id="participant-email"
                type={"email"}
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