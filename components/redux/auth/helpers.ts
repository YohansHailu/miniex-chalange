import CryptoJS from 'crypto-js'
import { debugErrorMap } from 'firebase/auth';

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
