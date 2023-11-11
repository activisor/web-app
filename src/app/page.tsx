'use client'

import { useSession } from 'next-auth/react';
import ScheduleInput from '../components/schedule-input';
import { readItem, saveItem, GENERATION_REQUESTED, SCHEDULE_DATA } from '../client-lib/local-storage';
import ScheduleData from '../lib/schedule-data';

// need client side to get DTO from Local Storgate
export default function Home() {
  // if token detected, get DTO, compress & redirect to /schedule with payload
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    const generationRequested = readItem(GENERATION_REQUESTED);
    if (!generationRequested) {
      saveItem(GENERATION_REQUESTED, true);
      const dto: ScheduleData = readItem(SCHEDULE_DATA);
      // make API call, redirect on result

      fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      })
        .then(response => response.json())
        .then(data => {
          // Handle API response data here
          console.log(data);
          window.open(data.url, '_self');
        })
        .catch(error => {
          // Handle errors here
          console.error('Error:', error);
        });
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Building Your Schedule</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Activisor</h1>
      <ScheduleInput />
    </main>
  );
}
