/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import { useFormik } from "formik";
import * as yup from "yup";

import { mq } from "@/lib/media-queries";
import type { Participant } from "@/lib/participant";
import './participant-accordion.css';

// DTO returned to parent
export interface SavedParticipant extends Participant {
    saved: boolean;
}

export interface ParticipantInputProps extends SavedParticipant {
    index: number;
    handleAdd(props: SavedParticipant): void;
    handleChange(props: SavedParticipant): void;
    handleDelete(props: SavedParticipant): void;
}

// use Formik/Yup only to validate email/name
const participantSchema = yup.object({
    email: yup.string().email("Invalid email address").required("Required"),
    name: yup.string(),
});

/**
 * participant entry/edit component
 * requires minimum 16px parent paddding left to align left textbox with other components
 * theme color dirty indicator in add mode
 * @param props ParticipantInputProps
 * @returns
 */
const ParticipantInput: React.FC<ParticipantInputProps> = (props) => {
    const [props_, setProps_] = useState(props as SavedParticipant);
    const [isDirty_, setIsDirty_] = useState(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    // Create a reference for the name TextField with proper typing for the HTMLInputElement
    const nameInputRef = useRef<HTMLInputElement | null>(null);

    const theme = useTheme();

    const cleanAddContainerStyle = css({
        paddingLeft: 12,
        marginLeft: -12,
        marginRight: -8,
    });
    const dirtyAddContainerStyle = css({
        marginLeft: -12,
        marginRight: -12,
        padding: 8,
        paddingTop: 12,
        paddingRight: 0,
        borderColor: theme.palette.primary.light,
        borderWidth: 4,
        borderStyle: "solid",
        borderRadius: 8,
    });

    const addContainerStyle = isDirty_ ? dirtyAddContainerStyle : cleanAddContainerStyle;
    const editContainerStyle = css({
        marginLeft: -16,
        marginRight: -8,
        [mq.sm]: {
            marginLeft: -24,
        },
    });
    const containerSyle = props_.saved ? editContainerStyle : addContainerStyle;

    const addParticipationContainerStyle = css({ marginTop: -4 });
    const savedParticipationContainerStyle = css({
        marginLeft: 16,
        marginTop: -4,
        [mq.sm]: {
            marginLeft: 24,
        },
    });
    const participationContainerStyle = props_.saved ? savedParticipationContainerStyle : addParticipationContainerStyle;

    const formik = useFormik({
        initialValues: {
            email: props_.email,
            name: props_.name,
            isHalfShare: props_.isHalfShare ? true : false,
        },

        validationSchema: participantSchema,

        onSubmit: (values) => { },
    });

    const handleAccordianChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.email = event.target.value;
        setProps_(tempProps);
        formik.handleChange(event);
        if (props_.saved) {
            formik.validateField("email");
            if (!Boolean(formik.errors.email)) {
                props.handleChange(tempProps);
            }
        }
    };

    // Function to set focus programmatically
    const focusName = () => {
        if (nameInputRef.current) {
            nameInputRef.current.focus(); // Set focus to the input field
        }
    };

    const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            formik.validateField("email");
            if (!Boolean(formik.errors.email)) {
                if (props_.saved) {
                    props.handleChange(props_);
                }

                focusName();
            }

            // prevent form submission
            event.preventDefault();
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.name = event.target.value;
        setProps_(tempProps);
        if (props_.saved) {
            props.handleChange(tempProps);
        }
    };

    const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            formik.validateField("email");
            if (props_.saved) {
                if (!Boolean(formik.errors.email)) {
                    props.handleChange(props_);
                    const nameInput = event.target as HTMLInputElement;
                    if (nameInput) {
                        nameInput.blur();
                    }
                }
            } else if (props_.email && props_.name) {
                if (!Boolean(formik.errors.email)) {
                    props.handleAdd(props_);
                    const initialProps: SavedParticipant = {
                        name: "",
                        email: "",
                        saved: false,
                        isHalfShare: false,
                    };
                    setProps_(initialProps);
                }
            }
            // prevent form submission
            event.preventDefault();
        }
    };

    const handleShareChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let tempProps = { ...props_ };
        tempProps.isHalfShare = event.target.value === "true" ? true : false;
        setProps_(tempProps);
        if (props_.saved) {
            props.handleChange(tempProps);
        }
    };

    const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        formik.validateField("email");
        props.handleAdd(props_);
        const initialProps: SavedParticipant = {
            name: "",
            email: "",
            saved: false,
            isHalfShare: false,
        };
        setProps_(initialProps);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        props.handleDelete(props_);
    };

    useEffect(() => {
        setIsDirty_(!props_.saved && (Boolean(props_.email) || Boolean(props_.name)));
    }, [props_]);

    return (
        <div css={[containerSyle, { marginLeft: -12 }]}>
            <div css={{ display: "flex" }} >
                {props_.saved ? (
                    <div
                        css={{
                            color: theme.palette.primary.dark,
                            fontSize: ".75rem",
                            textAlign: "center",
                            flexBasis: 16,
                            flexGrow: 0,
                            flexShrink: 0,
                            display: "grid",
                            alignItems: "center",
                            [mq.sm]: {
                                flexBasis: 24,
                            },
                        }}
                    >
                        {props.index}
                    </div>
                ) : null}
                <TextField
                    name="email"
                    id="participant-email"
                    label={props.saved ? "" : "Email"}
                    type={"email"}
                    inputProps={{ value: props_.email }}
                    onChange={handleEmailChange}
                    onKeyDown={handleEmailKeyDown}
                    error={
                        Boolean(formik.errors.email) &&
                        (Boolean(props_.name) || Boolean(props_.email))
                    }
                    helperText={
                        Boolean(formik.errors.email) &&
                            (Boolean(props_.name) || Boolean(props_.email))
                            ? formik.errors.email
                            : ""
                    }
                    css={{
                        marginRight: 8,
                        flexGrow: 1,
                    }}
                />
                <TextField
                    name="name"
                    id="participant-name"
                    label={props.saved ? "" : "Name"}
                    type="text"
                    inputProps={{ value: props_.name }}
                    inputRef={nameInputRef}
                    onChange={handleNameChange}
                    onKeyDown={handleNameKeyDown}
                    css={{
                        flexGrow: 1,
                    }}
                />
                {props_.saved ? (
                    <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={handleDeleteClick}
                    >
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
            <div
                css={{
                    paddingRight: 40
                }}
            >
                <div css={[participationContainerStyle, {
                    paddingLeft: 16,
                    paddingRight: 16,
                    [mq.sm]: {
                        paddingLeft: 48,
                        paddingRight: 48,
                    },
                }]}>
                    <Accordion
                        expanded={isDirty_ || expanded === 'panel1'}
                        onChange={handleAccordianChange('panel1')}
                        elevation={0}
                        css={{ backgroundColor: 'rgba(255, 250, 223, 0.1)' }} >
                        <AccordionSummary
                            expandIcon={isDirty_ ? null : <ExpandMoreIcon />}
                            aria-controls="participation-radio-content"
                            id="participation-radio-header"
                        >
                            <Typography variant="subtitle2" color="textSecondary">Membership</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div css={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                                <RadioGroup
                                    row
                                    aria-labelledby="participation-radio-buttons-group-label"
                                    name="paticipation-radio-buttons-group"
                                    value={props_.isHalfShare}
                                    onChange={handleShareChange}
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Half time" />
                                    <FormControlLabel value={false} control={<Radio />} label="Full time" />
                                </RadioGroup>
                            </div>

                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}

export default ParticipantInput;
