/** @jsxImportSource @emotion/react */
'use client'

import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import ContentCopy from '@mui/icons-material/ContentCopy';
import React, { useState } from 'react';

export interface CopyToClipboardButtonProps {
    value: string;
    color: string;
    valueName: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = (props) => {
    const [value_, setValue_] = useState(props.value);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(value_);
    };

    return (
        <>
            <Tooltip title={`copy ${props.valueName} to clipboard`}>
                <IconButton
                    aria-label="copy to clipboard"
                    color={'secondary'}
                    onClick={handleClick}>
                    <ContentCopy />
                </IconButton>
            </Tooltip>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message={`${props.valueName} copied to clipboard`}
            />
        </>
    )
}

export default CopyToClipboardButton;