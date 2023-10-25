// import Image from 'next/image'
import TextField from '@mui/material/TextField';

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
        <TextField id="schedule-name" type="text" inputProps={inputProps}/>
      </div>
    </main>
  )
}
