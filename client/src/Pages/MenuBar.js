import styles from "../styles/MenuBar.module.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function MenuBar(props) {
    const { loc } = props
    const [isHome, setIsHome] = useState(false)
    const [isHistory, setIsHistory] = useState(false)
    const [isFriends, setIsFriends] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (loc === "home") {
            setIsHome(true)
        } else if (loc === "history") {
            setIsHistory(true)
        } else if (loc === "friends") {
            setIsFriends(true)
        }
    }, [loc])

    function logout() {
        localStorage.removeItem("token")
        navigate("/")
    }

    return <div className={styles.menu}>
        <Link to="/home" style={{ textDecoration: 'none' }}>
            <div className={`${styles.menuItem} ${ isHome ? styles.active : styles.inactive}`}>
                <div style={{backgroundImage: `url('./home.png')`}} className={styles.icon}></div>
                <div className={styles.text}>Home</div>
            </div>
        </Link>
        <Link to="/history" style={{ textDecoration: 'none' }}>
            <div className={`${styles.menuItem} ${ isHistory ? styles.active : styles.inactive}`}>
                <div style={{backgroundImage: `url('./history.png')`}} className={styles.icon}></div>
                <div className={styles.text}>History</div>
            </div>
        </Link>
        <Link to="/friends" style={{ textDecoration: 'none' }}>
            <div className={`${styles.menuItem} ${ isFriends ? styles.active : styles.inactive}`}>
                <div style={{backgroundImage: `url('./friends.png')`}} className={styles.icon}></div>
                <div className={styles.text}>Friends</div>
            </div>
        </Link>

        <div className={styles.logout}>
            <div onClick={logout} className={`${styles.menuItem} ${styles.inactive}`}>
                <div style={{backgroundImage: `url('./logout.png')`}} className={styles.icon}></div>
                <div className={styles.text}>Logout</div>
            </div>
        </div>
    </div>
}