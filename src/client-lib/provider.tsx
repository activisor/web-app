// session and localization providers
"use client";

import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196F3',     // blue
        },
        secondary: {
            main: '#FF9800',   // orange
        }
    },
});

console.log(JSON.stringify(theme.palette));

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />
                    {children}
                </LocalizationProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}