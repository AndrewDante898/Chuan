// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Layout from '../components/layout/layout';
import '../components/layout/globals.css'; // Ensure you have global styles

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default MyApp;
