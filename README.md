
# Soprano!
## Things to know when developing
There are two components to Soprano: the frontend and backend
Frontend code is found in `/src` and backend code is found in `/backend/soprano`
For running locally, the frontend runs on `localhost:4200` and the backend runs on `localhost:3000`
We use the SpotifyAPI and our own database to manage the user's libraries and data
We really shouldn't be messing with the production database when developing so we have emulators for the database and Spotify API (but they're not really ready at the moment)

## Get it running
If this is your first time trying to run it or you are having some issues run `npm i` to install packages

For front frontend run `npm run frontend` in the terminal
For backend run `npm run backend-noem` in another terminal
Ideally, we would want to run `npm run backend` which would use the emulators, but those aren't really ready

You can update the front-end to and see changes without having to manually rebuild.
However, you must re-run the `npm run backend` or `npm run backend-noem` to see your changes to the backend.

## Understanding how it runs and build in-depth
Find the npm scripts in `/package.json` for reference
Arguments for the backend (case-sensitive):
    `NODE_ENV={development|production|test}`
    `EMULATE_DB={TRUE|FALSE}`
    `EMULATE_SPOTIFY={TRUE|FALSE}`

Development, production and test environments all have their own defaults for whether to emulate or not (dev and test emulate on default) but you can override those by specifying `EMULATE_DB` and/or `EMULATE_SPOTIFY`.

The production build builds all of the frontend code, and then runs `/server.js` which combines the backend code with the compiled front-end code and hosts them both.

