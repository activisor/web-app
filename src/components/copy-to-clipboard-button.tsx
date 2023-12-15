/** @jsxImportSource @emotion/react */
'use client'

import { IconButton, Snackbar, Tooltip } from '@mui/material'
import ContentCopy from '@mui/icons-material/ContentCopy';
import React, { useState } from 'react'

interface CopyToClipboardButtonProps {
    value: string;
    color: string;
    valueDescription: string;
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
            <Tooltip title={`Copy ${props.valueDescription} to clipboard`}>
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
                message={`${props.valueDescription} copied to clipboard`}
            />
        </>
    )
}

export { CopyToClipboardButton }