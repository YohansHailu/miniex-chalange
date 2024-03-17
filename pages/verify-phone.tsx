import Head from 'next/head';
import { NextPage } from 'next';
import PhoneVerification from '@/components/ui/PhoneVerification';
import styles from '@/styles/Home.module.css';
import { useAuth } from '@/components/useAuth';
import Spinner from '@/components/Spinner';
import { LoadingStateTypes } from '@/components/redux/types';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next/router';

import {
  nothing_have_been_done,
  is_loading,
  is_phone_missing,
} from '@/components/redux/auth/helpers';
import { useEffect, useState } from 'react';
import { is_phone_and_email_missing } from '@/components/redux/auth/helpers';

const VerifyPhone: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const { signin, link, signup } = router.query;


  let [is_email_linking, set_email_linking] = useState(false)
  useEffect(() => {
    set_email_linking(is_phone_and_email_missing(localStorage))
  }, []);

  // link -  is to link a phone number
  //signin - when trying to login using phone number
  // signup - when trying to sign up using phone number

  const isSignIn = signin === 'true';
  const isSignUp = signup === 'true';
  const isLink = link === 'true';


  if (is_loading(auth)) {
    return <Spinner />
  }

  if (is_email_linking) {
    router.push('/');
    return <Spinner />
  }

  if (isSignIn) {
    // if user is trying to sign in using phone number, there shall be no user
    if (!nothing_have_been_done(auth)) {
      router.push('/');
      return <Spinner />
    }
  }

  if (isSignUp) {
    // if user is trying to sign up using phone number, there shall be no user
    if (!nothing_have_been_done(auth)) {
      router.push('/');
      return <Spinner />
    }
  }

  if (isLink) {
    // email should be linked and phone number should be missing
    if (!is_phone_missing(auth)) {
      router.push('/');
      return <Spinner />
    }
  }

  if (!isSignIn && !isSignUp && !isLink) {
    router.push('/');
    return <Spinner />
  }

  const type = isSignIn ? 'signin' : isSignUp ? 'signup' : isLink ? 'link' : 'signin';
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PhoneVerification type={type} />
    </div>
  );
};

export default VerifyPhone;
