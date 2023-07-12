import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from 'axios'
import styles from "../styles/UserHome.module.css"
import MenuBar from "./MenuBar"
import Loading from "./Loading"
import Header from "./Header"

export default function UserHome() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const [isLoading, setIsLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const [userDetails, setUserDetails] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getInitialData()
    }, [])

    function getInitialData() {
        axios.get(baseURL + `/hub/home`, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.data.auth) {
                    setIsAuth(true)
                    const userDetails = {
                        "userID": res.data.userID,
                        "fullName": res.data.fullName
                    }
                    setUserDetails(userDetails)
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
        return <div>
            <Loading />
        </div>
    } else if (isAuth) {
        return <div className={styles.body}>
            <MenuBar loc="home"/>

            <div className={styles.allItems}>
                <Header name={userDetails.fullName} />
                <div className={styles.actions}>
                    <Link to="/create" style={{ textDecoration: 'none' }} className={styles.button}>
                        + Create Quiz
                    </Link>
                </div>
            </div>
        </div>
    } else {
        navigate("/")
    }
}