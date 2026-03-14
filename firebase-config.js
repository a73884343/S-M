const firebaseConfig = {
    apiKey: "ضع-API-KEY-هنا",
    authDomain: "ضع-PROJECT-ID.firebaseapp.com",
    projectId: "ضع-PROJECT-ID",
    storageBucket: "ضع-PROJECT-ID.appspot.com",
    messagingSenderId: "ضع-MESSAGING-SENDER-ID",
    appId: "ضع-APP-ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();