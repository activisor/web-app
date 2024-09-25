# Activisor
https://activisor.com

## Description

### Problem and Solution
People often need to create schedules for recurring activities among a roster of participants. An example might be a weekly schedule for a group of volunteers at a soup kitchen. The schedule needs to be created and shared with the participants. The participants need to be able to view the schedule and know when they are scheduled to work. The schedule needs to be updated and shared with the participants when changes are made. The schedule needs to be stored in a way that it can be accessed by the creator and updated as needed. Google Sheets handles many of these needs but it is not easy to create a schedule in Google Sheets, especially concerning equal participation and randomization of co-participants on any given scheduled day. A Solution would create a Google Sheets schedule to meet your needs and add it to your Google Drive for you.

### User Workflow
1. The user opens the app and fills in the parameters for the schedule they want to create, including:
    - the name of the schedule
    - the start date of the schedule
    - the end-by date of the schedule
    - the frequency (days of the week/weekly, every other week, monthly)
    - total cost
    - a list of participants' email addresses, names, half/full participation
2. The user clicks the "Create Schedule" button
3. The user is redirected to the Google OAuth form to authorize Activisor to access their Google Sheets
4. Authorized, the user is now redirected to Activisor's "Building Schedule" page while the schedule is being created
5. Upon creation, the user is redirected to a preview of their new Google Sheet schedule
6. The user can purchase the schedule and has discounted code and share options
7. Upon purchase, the user can share the schedule with the participants via email


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

## Tooling

Run at localhost:3000
```sh
npm run dev
```

### Testing

Run tests
```sh
npm test
```

Watch tests of single file
```sh
npm test -- --watch some-file.test
```
