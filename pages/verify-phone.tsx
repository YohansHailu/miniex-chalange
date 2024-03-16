import Head from 'next/head';
import { NextPage } from 'next';
import PhoneVerification from '@/components/ui/PhoneVerification';
import styles from '@/styles/Home.module.css';
import { useAuth } from '@/components/useAuth';
import Spinner from '@/components/Spinner';
import { LoadingStateTypes } from '@/components/redux/types';
import { useRouter } from 'next/navigation';

const VerifyPhone: NextPage = () => {
    const auth = useAuth();
    const router = useRouter();

    if (auth.type === LoadingStateTypes.LOADING) {
        return <Spinner />;
    } else if (
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

            <PhoneVerification />
        </div>
    );
};

export default VerifyPhone;
