/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { GoogleAuthProvider } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ToastBox from '@/components/ui/ToastBox';
import { useAppDispatch } from '@/components/redux/store';
import { useAuth } from '@/components/useAuth';
import Spinner from '@/components/Spinner';
import LoginWithGoogleButton from '@/components/ui/LoginWithGoogleButton';
import Input from '@/components/ui/Input';
import LoadingButton from '@/components/ui/LoadingButton';
import { decryptStoredPhoneNumberCredential, is_loading, is_phone_and_email_missing, nothing_have_been_done } from '@/components/redux/auth/helpers';
import { loginWithEmail, useIsLoginWithEmailLoading } from '@/components/redux/auth/loginWithEmail';
import { LoadingStateTypes } from '@/components/redux/types';
import UseYourPhoneButton from '@/components/ui/UseYourPhoneButton';
import Link from 'next/link';

export const googleLoginProvider = new GoogleAuthProvider();

const LoginPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);
  const isLoading = useIsLoginWithEmailLoading();

  let [is_email_linking, set_email_linking] = useState(false)

  useEffect(() => {
    set_email_linking(is_phone_and_email_missing(localStorage))
  }, []);

  const router = useRouter();

  const { link } = router.query;
  const isLink = link === 'true';

  // Realtime validation to enable submit button
  useEffect(() => {
    if (email && password.length >= 6) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [email, password]);

  // Signing in with email and password and redirecting to home page
  const signInWithEmail = useCallback(async () => {
    await dispatch(
      loginWithEmail({
        type: isLink ? 'sign-up' : 'login',
        email,
        password,
      })
    );
  }, [email, password, dispatch]);

  if (is_loading(auth)) {
    return <Spinner />;
  }


  if (isLink) {
    if (!is_email_linking) {
      router.push('/');
      return <Spinner />;
    }
  }

  if (!isLink) {
    if (!nothing_have_been_done(auth) && !is_email_linking) {
      router.push('/');
      return <Spinner />;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="w-auto h-12 mx-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            {isLink ? "link your email" : "Sign in to your account"}
          </h2>
        </div>

        <div className="max-w-xl w-full rounded overflow-hidden shadow-lg py-2 px-4">
          <div className="flex gap-4 mb-5 flex-col">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              name="email"
              type="text"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              name="password"
              type="password"
            />
            <LoadingButton
              onClick={signInWithEmail}
              disabled={disableSubmit}
              loading={isLoading}
            >
              {isLink ? "Link you email" : "Sign In"}
            </LoadingButton>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or login with</span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3">
              <LoginWithGoogleButton isLink={true} />
            </div>
            <div style={{ display: isLink ? "none" : "block" }}>
              <div className="mt-2 grid grid-cols-1 gap-3">
                <Link href="/verify-phone?signin=true">
                  <UseYourPhoneButton />
                </Link>
              </div>
              <div className="mt-6">
                <div className="flex justify-center">
                  <div className="relative flex justify-center text-sm">
                    <div className="font-small text-black-400">
                      Don&apos;t have an account?
                    </div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <div className="ml-2 cursor-pointer font-medium text-violet-600 hover:text-violet-400">
                      <Link href="/sign-up">Sign Up here</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastBox />
    </div>
  );
};

export default LoginPage;
