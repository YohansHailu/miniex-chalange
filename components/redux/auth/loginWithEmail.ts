import { createAsyncThunk } from '@reduxjs/toolkit';
import { decryptStoredPhoneNumberCredential, clearStoredPhoneNumberCredential } from './helpers';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  updatePhoneNumber
} from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import isEmail from 'validator/lib/isEmail';
import { useAppSelector } from '../store';
import { logout } from './logOut';

export const loginWithEmail = createAsyncThunk(
  'login',
  async (args: { type: 'login' | 'sign-up'; email: string; password: string }, { dispatch }) => {
    try {
      if (!isEmail(args.email)) {
        dispatch(
          showToast({
            message: 'Enter a valid email',
            type: 'info',
          })
        );
        return;
      }
      if (args.password.length < 6) {
        dispatch(
          showToast({
            message: 'Password should be atleast 6 characters',
            type: 'info',
          })
        );
        return;
      }
      if (args.type === 'sign-up') {
        await createUserWithEmailAndPassword(firebaseAuth, args.email, args.password);
        console.log("I didn't rich here what");

        if (decryptStoredPhoneNumberCredential(localStorage) !== null) {
          let data = decryptStoredPhoneNumberCredential(localStorage);
          await firebaseAuth.currentUser?.reload();
          console.log("am here about to cridet ", firebaseAuth.currentUser);
          if (firebaseAuth.currentUser) {
            console.log("am criditing", firebaseAuth.currentUser);
            try {
              console.log("am here about to update, here is --> ", data);
              const credential = PhoneAuthProvider.credential(data.verificationId, data.OTPCode);
              await updatePhoneNumber(firebaseAuth.currentUser, credential);

            } catch (e: any) {
              clearStoredPhoneNumberCredential(localStorage);
              dispatch(
                showToast({
                  message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                  type: 'error',
                })
              );

              dispatch(
                logout())
                ;
            }
          }

        }

      }

      await signInWithEmailAndPassword(firebaseAuth, args.email, args.password);
    } catch (e: any) {
      dispatch(
        showToast({
          message: getFriendlyMessageFromFirebaseErrorCode(e.code),
          type: 'error',
        })
      );
    }
  }
);

export const useIsLoginWithEmailLoading = () => {
  const loading = useAppSelector((state) => state.loading.loginWithEmail);
  return loading;
};
