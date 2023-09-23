# firebase
we use Firebase Functions (serverless) to handle airdrop events.

## quick start
You need to deploy your GamePrize contract before setting up this part!!

- setup a firebase project - https://firebase.google.com/ and update `.firebaserc` with your Project ID.

- set new env variables with `firebase functions:config:set key1=val1 key2=val2`. you need to set infura api key and a server wallet private key. plz check `index.js`

- get current env variables - `firebase functions:config:get`

- after setting env vars, download current env variable so that local emulator can run - `firebase functions:config:get > .runtimeconfig.json`

- in the functions folder, `npm install` and start local emulator - `firebase emulators:start --only functions`. This will run a local server for debugging. you need to update the server address in the Unreal Engine project.

## deployment

- in the firebase functions folder - `firebase deploy --only functions`




