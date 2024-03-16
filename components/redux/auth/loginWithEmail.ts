import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential
} from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import isEmail from 'validator/lib/isEmail';
import { useAppSelector } from '../store';

export const loginWithEmail = createAsyncThunk(
  'login',
  async (args: { type: 'login' | 'sign-up' | 'link'; email: string; password: string }, { dispatch }) => {
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
      console.log('am here with', args.type, firebaseAuth.currentUser);
      if (args.type === 'link' && firebaseAuth.currentUser != null) {
        console.log('am here with adding creaditional');
        let credential = EmailAuthProvider.credential(args.email, args.password);
        await linkWithCredential(firebaseAuth.currentUser, credential);
        console.log('done adding creadential');
      }
      if (args.type === 'sign-up') {
        await createUserWithEmailAndPassword(firebaseAuth, args.email, args.password);
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
