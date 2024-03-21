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

const cleanContainerStyle = css({
    paddingLeft: 12,
    paddingRight: 4
});
const dirtyContainerStyle = css({
    borderColor: '#BBDEFB',
    borderWidth: 4,
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 8,
    paddingRight: 0,
});

const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const [props_, setProps_] = useState(props);
    const isDirty = !props_.saved && (Boolean(props_.email) || Boolean(props_.name));
    const containerStyle = isDirty ? dirtyContainerStyle : cleanContainerStyle;

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
            const emailInput = event.target as HTMLInputElement;
            emailInput.blur();

            formik.validateField('email');
            if (!Boolean(formik.errors.email)) {
                if (props_.saved) {
                    publish(CHANGE_EVENT, props_);
                }

                // valid email: change focus to name field
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
            formik.validateField('email');
            if (props_.saved) {
                if (!Boolean(formik.errors.email)) {
                    publish(CHANGE_EVENT, props_);
                    const nameInput = event.target as HTMLInputElement;
                    if (nameInput) {
                        nameInput.blur();
                    }
                }
            } else if (props_.email && props_.name) {
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
        <div css={[{
            display: 'flex',
            marginLeft: -8,
            marginRight: -8,
        }, containerStyle]}>
            <TextField name="email"
                id="participant-email"
                label={props.saved ? '' : 'Email'}
                type={"email"}
                inputProps={{ value: props_.email}}
                onBlur={formik.handleBlur}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown}
                error={(Boolean(formik.errors.email) && (Boolean(props_.name) || Boolean(props_.email)))}
                helperText={(Boolean(formik.errors.email) && (Boolean(props_.name) || Boolean(props_.email)))? formik.errors.email : ''}
                css={{
                    marginRight: 8,
                    flexGrow: 1
                    }} />
            <TextField name="name"
                id="participant-name"
                label={props.saved ? '' : 'Name'}
                type="text"
                inputProps={{ value: props_.name }}
                onChange={handleNameChange}
                onKeyDown={handleNameKeyDown}
                css={{
                     flexGrow: 1
                    }} />
            {props_.saved ? (
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