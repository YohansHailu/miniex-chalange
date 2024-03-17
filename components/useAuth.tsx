import { User } from 'firebase/auth';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Spinner from './Spinner';
import { firebaseAuth } from './firebase/firebaseAuth';
import { LoadingStateTypes } from './redux/types';
import Header from './ui/Header';
import { useEffect } from 'react';
import {
  decryptStoredPhoneNumberCredential,
  nothing_have_been_done,
  is_loading,
  is_phone_missing,
  is_phone_and_email_missing,
  is_fully_loged_in
} from './redux/auth/helpers';


export type AuthContextType =
  | {
    type: LoadingStateTypes.LOADING;
  }
  | {
    type: LoadingStateTypes.NOT_LOADED;
  }
  | {
    type: LoadingStateTypes.LOADED;
    user: User;
  };

export const useAuth = (): AuthContextType => {
  const [user, loading] = useAuthState(firebaseAuth);

  return loading
    ? {
      type: LoadingStateTypes.LOADING,
    }
    : user == null
      ? {
        type: LoadingStateTypes.NOT_LOADED,
      }
      : {
        type: LoadingStateTypes.LOADED,
        user: user,
      };
};

export const AuthGuard = (props: { children: React.ReactElement }): React.ReactElement => {
  const authResult = useAuth();
  let [is_email_linking, set_email_linking] = useState(false)
  useEffect(() => {
    set_email_linking(is_phone_and_email_missing(localStorage))
  }, []);

  if (is_email_linking) {

    window.location.href = '/login?link=true'
    return <Spinner />;
  }

  if (nothing_have_been_done(authResult) && !is_email_linking) {
    console.log('nothing_have_been_done');
    window.location.href = '/login';
    return <Spinner />;
  }

  if (is_loading(authResult)) {
    return <Spinner />;
  }


  if (is_phone_missing(authResult)) {
    window.location.href = '/verify-phone?link=true';
    return <Spinner />;
  }


  if (is_fully_loged_in(authResult)) {
    return (
      <>
        <Header />
        {props.children}
      </>
    );
  }


  return (<h1> there is something wrong with your account, please try again </h1>)
};
