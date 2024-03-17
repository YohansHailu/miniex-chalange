import Head from 'next/head';
import { NextPage } from 'next';
import SignUpModal from '@/components/ui/SignUpModal';
import { useAuth } from '@/components/useAuth';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  nothing_have_been_done,
  is_loading,
  is_phone_and_email_missing
} from '@/components/redux/auth/helpers';

const VerifyPhone: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();

  let [is_email_linking, set_email_linking] = useState(false)
  useEffect(() => {
    set_email_linking(is_phone_and_email_missing(localStorage))
  }, []);

  if (is_loading(auth)) {
    return <Spinner />;
  }

  if (nothing_have_been_done(auth) && !is_email_linking) {
    return (
      <div style={{ height: '100%' }}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SignUpModal />
      </div>
    );
  }

  router.push('/');
  return <Spinner />;
};

export default VerifyPhone;
