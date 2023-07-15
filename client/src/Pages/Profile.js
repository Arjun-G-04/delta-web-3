import { useNavigate, useParams} from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "../styles/Profile.module.css"
import Loading from "./Loading"
import axios from "axios"
import MenuBar from "./MenuBar"
import Header from "./Header"

export default function Profile() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const { username } = useParams()
    const [profileDetails, setProfileDetails] = useState(null)
    const [ownerDetails, setOwnerDetails] = useState(null)
    const [auth, setAuth] = useState(false) 
    const [owner, setOwner] = useState(false)
    const [loading, setLoading] = useState(true)
    const [quizes, setQuizes] = useState([])
    const [noQuiz, setNoQuiz] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        setOwner(false)
        setNoQuiz(false)
        getInitialData()
    }, [username])

    function getInitialData() {
        axios.get(baseURL+`/hub/profile/${username}`, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.data.auth) {
                    setAuth(true)
                    setProfileDetails({"fullName":res.data.fullName})
                    setQuizes(res.data.quizes)
                    
                    if (res.data.quizes.length === 0) {
                        setNoQuiz(true)
                        console.log("here")
                    }

                    if (res.data.owner) {
                        setOwner(true)
                    }
                    
                    axios.get(baseURL+"/hub/home", {
                        headers: {
                            "x-access-token": localStorage.getItem('token')
                        }
                    })
                        .then((resp) => {
                            setOwnerDetails(resp.data)
                            setLoading(false)
                        })
                }
            })
    }

    if (loading) {
        return <Loading />
    } else {
        if (auth) {
            return <div className={styles.body}>
                <MenuBar />
                <div className={styles.allItems}>
                    <Header name={ownerDetails["fullName"]} username={ownerDetails["username"]}/>
                    <div className={styles.banner}>
                        <div className={styles.bannerContent}>
                            <div className={styles.nameDetails}>
                                <h1>{profileDetails['fullName']}</h1>
                                <h4>{username}</h4>
                            </div>
                            <div style={{backgroundImage: "url('/defaultProfile.png')"}}className={styles.profilePic}></div>
                        </div>
                    </div>

                    <div className={styles.mainContent}>
                        <div className={styles.quizList}>
                            <div className={styles.insideMargin}>
                                <h2>{ owner ? "Your Quizes" : `${profileDetails['fullName']}'s Quizes`}</h2>
                                {noQuiz ? <h3>No Quizes yet</h3> : 
                                <table>
                                <tbody>
                                    <tr>
                                        <th>Quiz Name</th>
                                        <th>Created On</th>
                                    </tr>
                                    {quizes.map((quiz) => {
                                        return <tr onClick={() => {navigate(`/quiz/${quiz.id}/view`)}} className={styles.quizes}>
                                            <td>{quiz.name}</td>
                                            <td>{quiz.createdAt.slice(0,10)}</td>
                                        </tr>
                                    })}
                                </tbody>
                                </table>
                            }
                            </div>
                        </div>
                        <div className={styles.friends}>
                            <div className={styles.insideMargin}>
                                <h2>Friend Request</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            navigate("/")
        }
    }
}