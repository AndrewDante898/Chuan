"use client";

import { ReactNode, Fragment } from "react";
import NavBar from '../layout/nav-bar';  // Adjust the import path as necessary
import Header from './header';
import styles from './layout.module.css'; // Import the layout styles

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <Fragment>
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
