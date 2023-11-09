'use client'

import { cookies } from 'next/headers'
import ScheduleInput from '../components/schedule-input';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Activisor</h1>
      <ScheduleInput />
    </main>
  )
}
