import Head from 'next/head';
import { NextPage } from 'next';
import styles from '@/styles/Home.module.css';
import SignUpModal from '@/components/ui/SignUpModal';
import { useAuth } from '@/components/useAuth';
import Spinner from '@/components/Spinner';
import { LoadingStateTypes } from '@/components/redux/types';
import { useRouter } from 'next/navigation';

const VerifyPhone: NextPage = () => {
    const auth = useAuth();
    const router = useRouter();

    if (auth.type === LoadingStateTypes.LOADING) {
        return <Spinner />;
    } else if (auth.type === LoadingStateTypes.LOADED) {
        router.push('/');
        return <Spinner />;
    }

    return (
        <div style={{ height: '100%' }}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SignUpModal />
        </div>
    );
};

export default VerifyPhone;
