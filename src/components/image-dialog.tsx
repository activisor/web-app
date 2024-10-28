/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { css } from '@emotion/react';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Info from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Close from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

export interface ImageDialogProps {
    name: string;
    src: string;
    alt: string;
    height: number;
    width: number;
    tagLine?: string;
    tooltip?: string;
};

const ImageDialog: React.FC<ImageDialogProps> = (props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();

    const handleIconButtonClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Tooltip title={props.tooltip}>
                <IconButton
                    aria-label="info"
                    color={'primary'}
                    onClick={handleIconButtonClick}>
                    <Info />
                </IconButton>
            </Tooltip>
            <Dialog onClose={handleDialogClose} open={dialogOpen} maxWidth="lg">
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {props.name}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleDialogClose}
                    color="primary"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
                <div
                    css={{
                        position: 'relative',
                        height: props.height,
                        width: props.width,
                    }}
                >
                    <Image
                        src={props.src}
                        alt={props.alt}
                        fill={true}
                        style={{
                            objectFit: 'contain'
                        }}
                    />
                </div>
                <div css={{
                    width: '100%',
                    paddingTop: 24,
                    paddingBottom: 16,
                    paddingLeft: 16,
                    paddingRight: 16,
                    display: 'flex',
                    justifyContent: 'center',
                }}><span css={{
                    color: theme.palette.primary.dark,
                    fontStyle: 'italic',
                }}>{props.tagLine ?? ''}</span></div>
            </Dialog>
        </>
    );
};

export default ImageDialog;