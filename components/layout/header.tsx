import styles from './header.module.css'; // Import header styles

function Header() {
    return (
        <div className={styles.layoutBar}>
            <div className={styles.title}>Lea's Guest House</div>
        </div>
    );
}

export default Header;
