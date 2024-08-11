import { Fragment } from "react";
import Link from 'next/link';
import styles from './nav-bar.module.css'; // Import NavBar styles

function NavBar() {
    return (
        <Fragment>
            <nav className={styles.navBar}>
                <ul>
                    <li>
                        <Link href="/">
                            <div className={styles.navLink}>Home</div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/ClientTable">
                            <div className={styles.navLink}>Client Table</div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <div className={styles.navLink}>Test</div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </Fragment>
    );
}

export default NavBar;
