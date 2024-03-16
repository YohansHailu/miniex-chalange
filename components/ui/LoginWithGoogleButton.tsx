import Image from 'next/image';
import GoogleGLogo from '@/public/statics/images/google-g-logo.svg';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseAuth';

import { decryptStoredPhoneNumberCredential, clearStoredPhoneNumberCredential } from '../redux/auth/helpers';
import { useEffect } from 'react';
import { PhoneAuthProvider, updatePhoneNumber } from 'firebase/auth';

const provider = new GoogleAuthProvider();

/**
 * Use this component to trigger Google modal and login with Google account
 * @returns
 */
const LoginWithGoogleButton = (prop: { isLink: boolean }) => {
  useEffect(() => {


  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;

      await firebaseAuth.currentUser?.reload();

      if (prop.isLink && decryptStoredPhoneNumberCredential(localStorage) !== null && firebaseAuth.currentUser) {

        let data = decryptStoredPhoneNumberCredential(localStorage);
        const credential = PhoneAuthProvider.credential(data.verificationId, data.OTPCode);
        await updatePhoneNumber(firebaseAuth.currentUser, credential);
        clearStoredPhoneNumberCredential(localStorage);
      }
      // just use local storage to use
      console.log(user, token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
      onClick={loginWithGoogle}
    >
      <Image src={GoogleGLogo} alt="Google logo" layout="intrinsic" height={20} width={20} />
      <div className="ml-2">Google</div>
    </button>
  );
};

export default LoginWithGoogleButton;
