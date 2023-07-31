import axios from "axios"
import { useEffect, useState } from "react"
import MenuBar from "./MenuBar"
import Header from "./Header"
import Loading from "./Loading"
import { useNavigate, Link } from "react-router-dom"
import styles from "../styles/Friend.module.css"

export default function Friend() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const [isLoading, setIsLoading] = useState(true)
    const [userDetails, setUserDetails] = useState(null)
    const [isAuth, setIsAuth] = useState(false)
    const [friends, setFriends] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getInitialData()
    }, [])

    useEffect(() => {
        if (userDetails != null) {
            getFriendsData()
        }
    }, [userDetails])

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
                        "fullName": res.data.fullName,
                        "username": res.data.username
                    }
                    setUserDetails(userDetails)
                } else {
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getFriendsData() {
        axios.get(baseURL+`/hub/friends/${userDetails.userID}`)
            .then((res) => {
                const details = res.data.output
                setFriends(details)
                setIsLoading(false)
            })
    }
    
    if (isLoading) {
        return <div>
            <Loading />
        </div>
    } else {
        if (isAuth) {
            return <div className={styles.body}>
            <MenuBar loc="friends"/>
            <div className={styles.allItems}>
                <Header name={userDetails.fullName} username={userDetails.username}/>
                <div className={styles.friends}>
                    <div className={styles.insideFriends}>
                        <h1>Friends</h1>
                        <table>
                            <tbody>
                                <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Profile</th>
                                </tr>

                                {friends.map((friend) => {
                                    return <tr className={styles.entry}>
                                        <td>{friend.name}</td>
                                        <td>{friend.username}</td>
                                        <td><Link to={`/user/${friend.username}`}>Link</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        <p>{ friends.length === 0 ? <h3>No Friends Yet</h3> : ''}</p>
                    </div>
                </div>
            </div>
        </div>
        } else {
            navigate("/")
        }
    }
}