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
    DEV_FEATURES: process.env.DEV_FEATURES === 'true',

    // bypass checkout dialog if true
    UNLOCKED: process.env.UNLOCKED === 'true',
};
