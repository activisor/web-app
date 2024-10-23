// ref: https://mui.com/material-ui/customization/breakpoints/#default-breakpoints

const breakpoints = [600, 900, 1200, 1536];
const xsbp = 400;

const mq = {
    sm: `@media (min-width: ${breakpoints[0]}px)`,
    md: `@media (min-width: ${breakpoints[1]}px)`,
    lg: `@media (min-width: ${breakpoints[2]}px)`,
    xl: `@media (min-width: ${breakpoints[3]}px)`,
}

export { mq, breakpoints, xsbp };