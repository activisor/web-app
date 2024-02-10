/** @jsxImportSource @emotion/react */

import Image from 'next/image';
import { css } from '@emotion/react';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

export interface ImageDialogProps {

    name: string;
    open: boolean;
    src: string;
    alt: string;
    height: number;
    width: number;
    tagLine?: string;
    onClose: () => void;
};

const ImageDialog: React.FC<ImageDialogProps> = (props) => {
    const theme = useTheme();

    const handleClose = () => {
        props.onClose();
    };

    return (
        <Dialog onClose={handleClose} open={props.open} maxWidth="lg">
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {props.name}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
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
                }}>{props.tagLine?? ''}</span></div>
        </Dialog>
    );
};

export default ImageDialog;