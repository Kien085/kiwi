import firebase from 'firebase';

try {
    let config = {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
<<<<<<< Updated upstream
        messagingSenderId: MESSAGING_SENDER_ID
=======
        messagingSenderId: MESSAGING_SENDER_ID,
>>>>>>> Stashed changes
    };
    console.log("HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    firebase.initializeApp(config);
} catch (e) { }

// - Storage reference
export let storageRef = firebase.storage().ref();

// - Database authorize
export let firebaseAuth = firebase.auth;
export let firebaseRef = firebase.database().ref();

// - Firebase default
export default firebase;