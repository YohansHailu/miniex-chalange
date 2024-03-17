import CryptoJS from 'crypto-js'
import { debugErrorMap } from 'firebase/auth';
import { LoadingStateTypes } from '../types';

export const getFriendlyMessageFromFirebaseErrorCode = (errorCode: string | null) => {
  const messageFromFirebase: string | null =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errorCode ? debugErrorMap()[errorCode.replace('auth/', '')] : null;
  return (
    messageFromFirebase ??
    'Something happened while we were processing your request, please try again.'
  );
};


export const encryptAndStorePhoneNumberCredential = (localStorage: any, data: any) => {
  const key = 'it-should-be-in-a-env-file-but-its-ok-for-this-example'
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  localStorage.setItem('encryptedDataPhoneNumber', encryptedData);
};

// Decrypt data from local storage
export const decryptStoredPhoneNumberCredential = (localStorage: any) => {
  const key = 'it-should-be-in-a-env-file-but-its-ok-for-this-example'
  const encryptedData = localStorage.getItem('encryptedDataPhoneNumber');
  if (encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
  return null;
};

export const clearStoredPhoneNumberCredential = (localStorage: any) => {
  localStorage.removeItem('encryptedDataPhoneNumber');
}



export const is_fully_loged_in = (authResult: any) => authResult.type === LoadingStateTypes.LOADED &&
  authResult.user !== null &&
  authResult.user.phoneNumber !== null &&
  authResult.user.email !== null

export const is_phone_missing = (authResult: any) => authResult.type === LoadingStateTypes.LOADED
  && authResult.user !== null
  && authResult.user.email !== null
  && authResult.user.phoneNumber === null;

// are phone and email yet to be verified
export const is_phone_and_email_missing = (localStorage: any) => decryptStoredPhoneNumberCredential(localStorage) !== null;


export const is_loading = (authResult: any) => authResult.type === LoadingStateTypes.LOADING;

export const nothing_have_been_done = (authResult: any) => authResult.type === LoadingStateTypes.NOT_LOADED;
