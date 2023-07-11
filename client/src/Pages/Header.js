import styles from "../styles/Header.module.css"

export default function Header(props) {
    const { name } = props
    return <div className={styles.body}>
        <div className={styles.searchBox}>
            <div className={styles.searchIcon}></div>
            <input className={styles.searchInput}></input>
        </div>
        <div className={styles.user}>
            {name}
        </div>
    </div>
}