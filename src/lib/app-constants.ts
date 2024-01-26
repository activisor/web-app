/**
 * app constants
 */

// Will be available on both server and client
export const publicRuntimeConfig = {
    // redirect path on authentication success
    SIGNIN_REDIRECT_PATH: '/building',

    // redirect path on authentication failure
    SIGNOUT_REDIRECT_PATH: '/schedule',

    // enable dev features if true
    DEV_FEATURES: process.env.NEXT_PUBLIC_DEV_FEATURES === 'true',

    // max number of participants
    MAX_PARTICIPANTS: parseInt(process.env.NEXT_PUBLIC_MAX_PARTICIPANTS as string, 10),

    MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string,
};
