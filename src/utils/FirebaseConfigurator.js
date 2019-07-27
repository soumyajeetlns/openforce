import firebase from 'firebase'


let projectId = '';
if (process.env.REACT_APP_ENV === 'prod') {
    const prodConfig = {
        apiKey: "AIzaSyCNCeQgLdz2hLHUgAHwGFY3yFA0-rl62h0",
        authDomain: "openforce-production.firebaseapp.com",
        databaseURL: "https://openforce-production.firebaseio.com",
        projectId: "openforce-production",
        storageBucket: "openforce-production.appspot.com",
        messagingSenderId: "252074354630"
    };
    projectId = 'openforce-production';
    if (!firebase.apps.length) {
        firebase.initializeApp(prodConfig);
    }
} else {
    const stagingConfig = {
        apiKey: "AIzaSyC64VRKcuz-GlgtVFKs5w3PlgKAapWX3Eo",
        authDomain: "openforce-staging.firebaseapp.com",
        databaseURL: "https://openforce-staging.firebaseio.com",
        projectId: "openforce-staging",
        storageBucket: "openforce-staging.appspot.com",
        messagingSenderId: "113807492392"
    };
    projectId = 'openforce-staging';
    if (!firebase.apps.length) {
        firebase.initializeApp(stagingConfig);
    }
}



export const ProjectId = projectId;
export const FirebaseRef = firebase.firestore();
export const FirebaseFunctionsRef = firebase.functions();

const settings = {timestampsInSnapshots: true};
FirebaseRef.settings(settings);

export const FirebaseAuth = firebase.auth