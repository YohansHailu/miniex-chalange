import { User } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Spinner from './Spinner';
import { firebaseAuth } from './firebase/firebaseAuth';
import { LoadingStateTypes } from './redux/types';
import Header from './ui/Header';

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
  // sleep 1 second

  if (authResult.type === LoadingStateTypes.LOADING) {
    return <Spinner />;
  } else if (
    authResult.type === LoadingStateTypes.NOT_LOADED ||
    (authResult.type === LoadingStateTypes.LOADED && authResult.user.email == null)
  ) {
    window.location.href = '/login';
    return <Spinner />;
  } else if (
    authResult.type === LoadingStateTypes.LOADED &&
    authResult.user != null &&
    authResult.user.phoneNumber == null
  ) {
    window.location.href = '/verify-phone?link=true';
    return <Spinner />;
  } else if (
    authResult.type === LoadingStateTypes.LOADED &&
    authResult.user != null &&
    authResult.user.phoneNumber != null &&
    authResult.user.email?.split("@")[1] === "notRealDomain.com"
  ) {
    window.location.href = '/sign-up?link=true';
    return <Spinner />;
  }



  else {
    return (
      <>
        <Header />
        {props.children}
      </>
    );
  }
};
