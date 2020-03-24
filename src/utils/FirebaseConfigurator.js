import firebase from 'firebase'


let projectId = '';
if (process.env.REACT_APP_ENV === 'prod') {
    const prodConfig = {
        apiKey: "AIzaSyDIo2XySfzCCl5SEVG_C2NARdvoRXh-Gtw",
        authDomain: "openforce-production-b12c0.firebaseapp.com",
        databaseURL: "https://openforce-production-b12c0.firebaseio.com",
        projectId: "openforce-production-b12c0",
        storageBucket: "openforce-production-b12c0.appspot.com",
        messagingSenderId: "192642366353"
    };
    projectId = 'openforce-production';
    if (!firebase.apps.length) {
        firebase.initializeApp(prodConfig);
    }
} else {
    const stagingConfig = {
        apiKey: "AIzaSyBy2U9MJl4zPQaLA8L833pm106oUf1Y4nM",
        authDomain: "openforce-staging-309a1.firebaseapp.com",
        databaseURL: "https://openforce-staging-309a1.firebaseio.com",
        projectId: "openforce-staging-309a1",
        storageBucket: "openforce-staging-309a1.appspot.com",
        messagingSenderId: "842641980365"
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