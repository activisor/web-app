/** @jsxImportSource @emotion/react */
'use client'

import { IconButton, Snackbar } from '@mui/material'
import ContentCopy from '@mui/icons-material/ContentCopy';
import React, { useState } from 'react'

interface CopyToClipboardButtonProps {
    value: string;
    color: string;
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
          <IconButton
            aria-label="copy to clipboard"
            color={'secondary'}
            onClick={handleClick}>
            <ContentCopy />
          </IconButton>
          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
        </>
    )
}

export { CopyToClipboardButton }