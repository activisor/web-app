
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * server-side auth cookie check
 */
export default function Schedule() {
    const cookieStore = cookies()
    const nextAuthCookie = cookieStore.get('next-auth.session-token');
    if (nextAuthCookie) {
        // redirect to client side page
        redirect('/build-schedule');
    } else {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <h1>You have been logged out</h1>
            </main>
        );
    }
}