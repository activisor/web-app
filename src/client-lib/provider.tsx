// session and localization providers
"use client";

import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from "@mui/material/CssBaseline";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                {children}
            </LocalizationProvider>
        </SessionProvider>
    );
}