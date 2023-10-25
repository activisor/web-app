'use client'

// import Image from 'next/image'
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function Home() {
  const inputProps = {
    placeholder: 'Schedule Name',
    required: true,
    autoFocus: true
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Activisor</h1>
      <div id="container" className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <TextField id="schedule-name" type="text" inputProps={inputProps} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start on" />
          <DatePicker label="End by" />
        </LocalizationProvider>
      </div>
    </main>
  )
}
