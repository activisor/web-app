/**
 * app constants
 */

// Will be available on both server and client
export const publicRuntimeConfig = {
    // redirect path on authentication success
    AUTH_REDIRECT_PATH: '/building',

    // enable dev features if true
    DEV_FEATURES: process.env.DEV_FEATURES === 'true',

    // bypass checkout dialog if true
    UNLOCKED: process.env.UNLOCKED === 'true',
};
