import { ReactNode, Fragment } from "react";
import Head from 'next/head';
import NavBar from '../layout/nav-bar';
import Header from './header';
import styles from './layout.module.css';
import DataTable from 'datatables.net-dt';
import 'jquery';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <Fragment>
            <Head>
                <script
                    src="../layout/s9s.js" // Adjust the path as necessary
                    async
                    defer
                />
            </Head>
            <Header />
            <div className={styles.layoutContainer}>
                <NavBar />
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </Fragment>
    );
}

export default Layout;