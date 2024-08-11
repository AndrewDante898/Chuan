import styles from './header.module.css'; // Import header styles

function Header() {
    return (
        <div className={styles.layoutBar}>
            <div className={styles.title}>AI Chat</div>
        </div>
    );
}

export default Header;
