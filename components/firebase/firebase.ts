// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, DocumentSnapshot } from 'firebase/firestore';

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
