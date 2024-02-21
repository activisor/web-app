/** @jsxImportSource @emotion/react */
'use client'

import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { SvgIconPropsSizeOverrides } from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { OverridableStringUnion } from '@mui/types';
import React, { useState } from 'react';
import { useMixPanel } from '@/client-lib/analytics';

export interface CopyToClipboardButtonProps {
    value: string;
    color: string;
    valueName: string;
    fontSize?: OverridableStringUnion<
        'inherit' | 'large' | 'medium' | 'small',
        SvgIconPropsSizeOverrides>;
};

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = (props) => {
    const mixpanel = useMixPanel();
    const [value_, setValue_] = useState(props.value);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(value_);
        mixpanel.track(`${props.valueName} copied`, { value: value_ });
    };

    return (
        <>
            <Tooltip title={`copy ${props.valueName} to clipboard`}>
                <IconButton
                    aria-label="copy to clipboard"
                    color={'secondary'}
                    onClick={handleClick}>
                    <ContentCopy fontSize={props.fontSize?? 'medium'}/>
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