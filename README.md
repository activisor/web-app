# Activisor
## Video Demo: https://youtu.be/Qgbl4iZW76U

## Description

### Problem and Solution
People often need to create schedules for recurring activities among a roster of participants. An example might be a weekly schedule for a group of volunteers at a soup kitchen. The schedule needs to be created and shared with the participants. The participants need to be able to view the schedule and know when they are scheduled to work. The schedule needs to be updated and shared with the participants when changes are made. The schedule needs to be stored in a way that it can be accessed by the creator and updated as needed. Google Sheets handles many of these needs but it is not easy to create a schedule in Google Sheets, especially concerning equal participation and randomization of co-participants on any given scheduled day. A Solution would create a Google Sheets schedule to meet your needs and add it to your Google Drive for you.

### User Workflow
1. The user opens the app and fills in the parameters for the schedule they want to create, including:
    - the name of the schedule
    - the start date of the schedule
    - the end-by date of the schedule
    - the frequency (daily, weekly, every other week, monthly)
    - a list of participants' email addresses and names
2. The user clicks the "Create Schedule" button
3. The user is redirected to the Google OAuth form to authorize Activisor to access their Google Sheets
4. Authorized, the user is now redirected to Activisor's "Building Schedule" page while the schedule is being created
5. Upon creation, the user is redirected to their new Google Sheet schedule


### Design Description
Activisor is a web app that, with a few parameters and the user's authorization, will create a google sheet schedule and add it to their google drive. As Activisor works with Google apps, such as Sheets, it uses Google's Material Design system (visual design language).

It comprises both web pages, with Javascript running in the browser, and REST API endpoints (running on the server) called from the pages in the browser. The backend calls the Google Auth and Google Sheets APIs to authenticate and authorise the user and then create the schedule and add it to the user's Google Drive.

Persistence is lightweight; the user's form data is stored in browser Local Storage so that it can be retrieved after authorization and used to create the schedule. The user's OAuth2 tokens are stored in a JWT cookie for use in subsequent Google API calls.

### Technologies Used
- UI components: MUI Material UI (React component) library, Emotion CSS-in-JS library
- Frontend/Backend framework: Next.js (React frontend, Node.js backend), using TypeScript
- Authentication/Authorization: NextAuth.js, Google OAuth2, JWT cookies (for authentication and authorization)
- Persistence: browser Local Storage
- Service Integrations: Google Sheets API
- Dependency Injection: InversifyJs
- Testing: Jest

### Summary of Key Files
#### Web Pages
- (/) home page (src/app/page.tsx): the home page is the main page of the app. It contains the form for the user to fill out the parameters for the schedule they want to create. It also contains the "Create Schedule" button that will trigger the creation of the schedule. The form data is stored in browser Local Storage so that the user can return to the form and continue filling it out if they leave the page. The form data is also stored in a React Context so that it can be accessed by other components. When the "Create Schedule" button is clicked, the user is redirected to the Google OAuth form to authorize Activisor to access their Google Sheets. The form data is stored in browser Local Storage so that it can be retrieved after authorization and used to create the schedule.
- (/schedule) building page (src/app/schedule/page.tsx): the browser redirects to this page after the user authorizes Activisor to access their Google Sheets. The page POSTs the form data stored in browser Local Storage to /api/schedule

#### API Routes
- (/api/auth) auth route (src/app/api/[...auth]/route.ts): this route is used by NextAuth to authenticate and authorize the user with Google OAuth2. It is also used to save the user's OAuth2 tokens to the JWT session cookie for use in subsequent Google API calls.
- (/api/schedule) schedule route (src/app/api/schedule/route.ts): this route is used to create the schedule and add it to the user's Google Drive. It returns the new sheet's ID for use in navigating to the sheet's URL.

#### React UI Components (src/components/)
- ParticipantInput (participant-input.tsx): this component is used to create or change a schedule participant.
- ScheduleInput (schedule-input.tsx): this component is used to enter the schedule parameters and create the schedule.

#### Client Libraries (src/client-lib/, used in-browser)
- events.ts: pub-sub event system for communication between components
- local-storage.ts: browser Local Storage wrapper for storing and retrieving data
- provider.tsx: React Context provider for storing and retrieving data

#### General Libraries (src/lib/)
- auth.ts: authorization provider configuration and post-authorization token management
- frequency.ts: enum for schedule event ocurrence frequency
- participants.ts: participant data model
- schedule-data.ts: schedule parameters data model

#### Dependency Injection (src/)
- inversify-types.ts: types for dependency injection
- inversify.config.ts: concrete class bindings for dependency injection

#### Analytics (src/analytics/)
- pairs-variance.ts: calculates the variance among the ocurrence counts of each unique pair of participants in a schedule. Used to determine how random a schedule is.

#### Design Considerations
- language and server: Node.js was selected in order to use a single language for both frontend and backend.
- Javascript/Typescript framework: Next.js was selected because it's supported by a large ecosystem, handles API/page routing, and integrates the React front-end framework.
- UI components: MUI Material UI provides Material Design React components, fulfilling a UI design goal.
- Dependency Injection (DI): I decided to use DI to facilitate unit testing and the swapping in and out of progressively sophisticated schedule creation utilities, starting with placeholders. InversifyJs was selected because it's a popular DI library that supports Typescript.
- Typescript: Typescript was selected because it's a superset of Javascript that provides static type checking and other features that make it easier to write and maintain code. This facilitates interface-based dependencies and then unit testing, DI, and refactoring.
- CSS-in-JS: I chose Emotion (used by the MUI components) over Tailwind (Next.js's default) in order to use a single system overall.
- Persistence: I chose browser Local Storage over a database because the data is simple and doesn't need to be shared with other users. It greatly simplifies architecture and deployment on a cloud platform.
- Authentication/Authorization: I chose NextAuth.js over directly using Google's Auth API for only authorization because it adds authentication (logging in/out) and session management. It also provides a simple way to store the user's OAuth2 tokens in a JWT cookie for use in subsequent Google API calls. Authentication allows expansion of in-app user features in the future.
- Randomization algorithm: Two broad approaches were considered; a brute force permutation generation of a collection of schedules and a single pass with weighted randomization, where the weight coefficients are based on the whether ocurrence counts of each unique pair of participants in a schedule are greater than the expected average by that event in the schedule. The brute force approach was rejected because it would be too slow for large schedules. The weighted randomization approach was selected because it's fast and produces a schedule that is random enough for most purposes. The variance of the ocurrence counts of each unique pair of participants in a schedule is used as a proxy for determining how random a schedule is. The variance is calculated by the pairs-variance.ts module.
