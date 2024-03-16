// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { /* connectFirestoreEmulator, */ getFirestore } from 'firebase/firestore';
import { /* connectStorageEmulator, */ getStorage } from 'firebase/storage';
// import { isDev } from '../isDev';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDko-rD0WTngRttJn7iEnCwQY6iiUp6Qg8',
    authDomain: 'miniextentions.firebaseapp.com',
    projectId: 'miniextentions',
    storageBucket: 'miniextentions.appspot.com',
    messagingSenderId: '945367758906',
    appId: '1:945367758906:web:e96cec5e637c16c1841d03',
    measurementId: 'G-9VFM614QJT',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const baseBucketName = 'miniextentions';

/* if (isDev) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
} */
