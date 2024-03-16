import Head from 'next/head';
import { NextPage } from 'next';
import PhoneVerification from '@/components/ui/PhoneVerification';
import styles from '@/styles/Home.module.css';
import { useAuth } from '@/components/useAuth';
import Spinner from '@/components/Spinner';
import { LoadingStateTypes } from '@/components/redux/types';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next/router';

const VerifyPhone: NextPage = () => {
    const auth = useAuth();
    const router = useRouter();

    const { signin, link } = router.query;

    const isSignIn = signin === 'true';
    const isLink = link === 'true';

    if (!isLink && !isSignIn) {
        return null;
    }

    const type = isSignIn ? 'signin' : 'link';

    const PhoneAlreadyLinked =
        auth.type === LoadingStateTypes.LOADED &&
        auth.user != null &&
        auth.user.phoneNumber != null;
    const isAuthNotLoaded = auth.type === LoadingStateTypes.NOT_LOADED;

    if (auth.type === LoadingStateTypes.LOADING) {
        return <Spinner />;
    } else if (isLink === true && (PhoneAlreadyLinked || isAuthNotLoaded)) {
        router.push('/');
        return <Spinner />;
    } else if (
        isSignIn &&
        auth.type === LoadingStateTypes.LOADED &&
        auth.user != null &&
        auth.user.phoneNumber != null
    ) {
        router.push('/');
        return <Spinner />;
    }

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
