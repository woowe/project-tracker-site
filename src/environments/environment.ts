// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  type: 'dev',
  firebaseConfig: {
    apiKey: "AIzaSyCMogGtV5wBkx8wB2DuZrQ4ywxSUkllT84",
    authDomain: "project-tracker-staging.firebaseapp.com",
    databaseURL: "https://project-tracker-staging.firebaseio.com",
    storageBucket: "project-tracker-staging.appspot.com",
    messagingSenderId: "881119132827"
  }
};
