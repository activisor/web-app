'use client'

// import Image from 'next/image'
import ScheduleInput from '../components/schedule-input';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Activisor</h1>
      <ScheduleInput />
    </main>
  )
}
