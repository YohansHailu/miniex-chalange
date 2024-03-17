// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// use environment variables to store the firebase config


// Comment the following and uncoment  at the end

// import { firebaseApiConfig } from './config';
// const firebaseConfig = {
//   ...firebaseApiConfig,
// };

// export const firebaseApp = initializeApp(firebaseConfig);
// export const firestore = getFirestore(firebaseApp);
// export const baseBucketName = 'FILL_ME_IN';


// uncomment the following lines and fill in the values with your own

const firebaseConfig = {
  apiKey: 'FILL_ME_IN',
  authDomain: 'FILL_ME_IN',
  projectId: 'FILL_ME_IN',
  storageBucket: 'FILL_ME_IN',
  messagingSenderId: 'FILL_ME_IN',
  appId: 'FILL_ME_IN',
  measurementId: 'FILL_ME_IN',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const baseBucketName = 'FILL_ME_IN';
