const firebaseConfig = {
  apiKey: "AIzaSyBgeIiTFw_U3_fDVaQursXGHpCi_LZrCA8",
  authDomain: "smvip-9f191.firebaseapp.com",
  projectId: "smvip-9f191",
  storageBucket: "smvip-9f191.firebasestorage.app",
  messagingSenderId: "856697553266",
  appId: "1:856697553266:web:2d3c97133f7cd05f709deb",
  measurementId: "G-M0HZFEEXHH"
};
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();