import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  updatePhoneNumber,
  signInWithCredential,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { checkPhoneNumberInBucket, addPhoneNumberToBucket } from '@/components/firebase/firebase';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import { LoadingStateTypes } from '../types';
import { AuthContextType } from '@/components/useAuth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import crypto from 'crypto';
import { loginWithEmail } from './loginWithEmail';

export const sendVerificationCode = createAsyncThunk(
  'sendVerificationCode',
  async (
    args: {
      phoneNumber: string;
      type: 'link' | 'signin' | 'signup';
      auth: AuthContextType;
      recaptchaResolved: boolean;
      recaptcha: RecaptchaVerifier | null;
      callback: (
        args:
          | { type: 'success'; verificationId: string }
          | {
            type: 'error';
            message: string;
          }
      ) => void;
    },
    { dispatch }
  ) => {
    if (!args.recaptchaResolved || !args.recaptcha) {
      dispatch(showToast({ message: 'First Resolved the Captcha', type: 'info' }));
      return;
    }
    if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
      dispatch(
        showToast({
          message: 'Enter the Phone Number and provide the country code',
          type: 'info',
        })
      );
      return;
    }

    try {
      let sentConfirmationCode;
      if (args.type === 'link') {
        if (args.auth.type !== LoadingStateTypes.LOADED) return;
        sentConfirmationCode = await linkWithPhoneNumber(
          args.auth.user,
          args.phoneNumber,
          args.recaptcha
        );
      } else if (args.type === 'signin' || args.type === 'signup') {
        sentConfirmationCode = await signInWithPhoneNumber(
          firebaseAuth,
          args.phoneNumber,
          args.recaptcha
        );
      }

      dispatch(
        showToast({
          message: 'Verification Code has been sent to your Phone',
          type: 'success',
        })
      );

      if (args.callback)
        args.callback({
          type: 'success',
          verificationId: sentConfirmationCode?.verificationId || '',
        });
    } catch (error: any) {
      dispatch(
        showToast({
          message: getFriendlyMessageFromFirebaseErrorCode(error.code),
          type: 'error',
        })
      );
      if (args.callback)
        args.callback({
          type: 'error',
          message: getFriendlyMessageFromFirebaseErrorCode(error.code),
        });
    }
  }
);

export const useSendVerificationCodeLoading = () => {
  const loading = useSelector((state: RootState) => state.loading.sendVerificationCode);
  return loading;
};

export const verifyPhoneNumber = createAsyncThunk(
  'verifyPhoneNumber',
  async (
    args: {
      type: 'link' | 'signin' | 'signup';
      OTPCode: string;
      auth: AuthContextType;
      verificationId: string;
      phoneNumber: string;
      callback: (
        args:
          | { type: 'success' }
          | {
            type: 'error';
            message: string;
          }
      ) => void;
    },
    { dispatch }
  ) => {
    if (args.OTPCode === null || !args.verificationId) return;
    console.log('verifying phone number');

    try {
      const credential = PhoneAuthProvider.credential(args.verificationId, args.OTPCode);
      if (args.type === 'link' || args.type === 'signup') {
        if (args.auth.type !== LoadingStateTypes.LOADED && args.type === 'link') return;

        if (args.type === 'signup') {
          console.log('signing random error');
          await createUserWithEmailAndPassword(
            firebaseAuth,
            args.phoneNumber + '@gmail.com',
            crypto.randomBytes(20).toString('hex')
          );
          // dispatch(loginWithEmail({ type: "sign-up", email: args.phoneNumber + '@gmail.com', password: crypto.randomBytes(20).toString('hex') }));
          console.log('done sigining with email random error');
        }
        if (firebaseAuth.currentUser) {
          console.log('linking phone number');
          await updatePhoneNumber(firebaseAuth.currentUser, credential);
        }
      } else if (args.type === 'signin') {
        await signInWithCredential(firebaseAuth, credential);
      }

      firebaseAuth.currentUser?.reload();

      dispatch(
        showToast({
          message: 'Logged in Successfully',
          type: 'success',
        })
      );

      args.callback({ type: 'success' });
    } catch (error: any) {
      dispatch(
        showToast({
          message: getFriendlyMessageFromFirebaseErrorCode(error.code),
          type: 'error',
        })
      );
      if (args.callback)
        args.callback({
          type: 'error',
          message: getFriendlyMessageFromFirebaseErrorCode(error.code),
        });
    }
  }
);

export const useVerifyPhoneNumberLoading = () => {
  const loading = useSelector((state: RootState) => state.loading.verifyPhoneNumber);
  return loading;
};
