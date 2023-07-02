import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from 'axios'
import styles from "../styles/UserHome.module.css"
import MenuBar from "./MenuBar"

export default function UserHome() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const [isLoading, setIsLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const [userID, setUserID] = useState(null)
    const navigate = useNavigate()

    getInitialData()

    function getInitialData() {
        axios.get(baseURL + `/hub/home`, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.data.auth) {
                    setIsAuth(true)
                    setUserID(res.data.userID)
                    setIsLoading(false)
                } else {
                    setIsLoading(false)
                }
            })
            .catch(() => {
                console.log("error")
            })
    }

    if (isLoading) {
        return <div className={styles.loaderBody}>
            <div className={styles.spinner}></div>
        </div>
    } else if (isAuth) {
        return <div>
            <MenuBar loc="home"/>
        </div>
    } else {
        navigate("/")
    }
}