// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, DocumentSnapshot } from 'firebase/firestore';
// use environment variables to store the firebase config
import { firebaseApiConfig } from './config.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  ...firebaseApiConfig,
};

// uncomment the following lines and fill in the values with your own

// const firebaseConfig = {
//   apiKey: 'FILL_ME_IN',
//   authDomain: 'FILL_ME_IN',
//   projectId: 'FILL_ME_IN',
//   storageBucket: 'FILL_ME_IN',
//   messagingSenderId: 'FILL_ME_IN',
//   appId: 'FILL_ME_IN',
//   measurementId: 'FILL_ME_IN',
// };


// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const baseBucketName = 'miniextentions';

export const addPhoneNumberToBucket = async (phoneNumber: string) => {
  try {
    // Add the phone number document to the bucket
    await setDoc(doc(firestore, baseBucketName, phoneNumber), { exists: true });
    console.log('Phone number added to the bucket:', phoneNumber);
    return true;
  } catch (error) {
    console.error('Error adding phone number to the bucket:', error);
    return false;
  }
};

export const checkPhoneNumberInBucket = async (phoneNumber: string) => {
  try {
    // Check if the document with the phone number exists in the bucket
    const docSnapshot: DocumentSnapshot = await getDoc(
      doc(firestore, baseBucketName, phoneNumber)
    );
    if (docSnapshot.exists()) {
      console.log('Phone number exists in the bucket:', phoneNumber);
      return true;
    } else {
      console.log('Phone number does not exist in the bucket:', phoneNumber);
      return false;
    }
  } catch (error) {
    console.error('Error checking phone number in the bucket:', error);
    return false;
  }
};
