// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDektJlbGUum3X0NLW13oOWkrqT3VcfTG8',
    authDomain: 'tic-tac-toe-acb7f.firebaseapp.com',
    databaseURL: 'https://tic-tac-toe-acb7f.firebaseio.com',
    projectId: 'tic-tac-toe-acb7f',
    storageBucket: 'tic-tac-toe-acb7f.appspot.com',
    messagingSenderId: '741600020933'
  },
  path: 'http://localhost:8080'
};
