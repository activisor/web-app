// session and localization providers
"use client";

import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AnalyticsProvider } from "./analytics";

// duplicated theme palette from globals.css bc getting css vars from window is not available in client
const theme = createTheme({
    palette: {
        primary: {
            main: '#2194F3',     // blue
            light: '#BBDEFB',    // light blue
            dark: '#1A75D2',     // dark blue
        },
        secondary: {
            main: '#FF9900',   // orange
            light: '#FFE0B2',  // light orange
            dark: '#F57D00',   // dark orange
        }
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider>
                <AnalyticsProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CssBaseline />
                        {children}
                    </LocalizationProvider>
                </AnalyticsProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}