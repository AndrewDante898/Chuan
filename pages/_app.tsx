import type { AppProps } from 'next/app';
import Layout from '../components/layout/layout';
import '../components/layout/globals.css'; // Ensure you have global styles
import { Provider } from 'react-redux';
import { store } from '@/Redux/Store'; // Adjust the path as needed

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
};

export default MyApp;
