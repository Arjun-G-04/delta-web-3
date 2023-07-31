import { useNavigate, useParams} from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { BiSolidEdit } from "react-icons/bi"
import styles from "../styles/Profile.module.css"
import Loading from "./Loading"
import axios from "axios"
import MenuBar from "./MenuBar"
import Header from "./Header"
import FriendBox from "./FriendBox"

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
    const [imageURL, setImageURL] = useState('/defaultProfile.png')
    const [friendStatus, setFriendStatus] = useState("request")
    const fileInputRef = useRef(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        setOwner(false)
        setNoQuiz(false)
        getInitialData()
        changeProfilePic()
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
                    setProfileDetails({"fullName":res.data.fullName, "id":res.data.id})
                    setQuizes(res.data.quizes)
                    
                    if (res.data.quizes.length === 0) {
                        setNoQuiz(true)
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
                } else {
                    setLoading(false)
                }
            })
    }

    function inputClick() {
        fileInputRef.current.click()
    }

    function onFileChange(event) {
        const uploadedFile = event.target.files[0]
        const formData = new FormData()
        formData.append('profilePic', uploadedFile)
        fileInputRef.current.value = null
        axios.post(baseURL+`/hub/upload/${username}`, formData)
            .then((res) => {
                changeProfilePic()
            })
    }

    function changeProfilePic() {
        axios.get(baseURL+`/hub/profilePic/${username}`, {
            responseType: "blob"
        })
            .then((res) => {
                setImageURL(URL.createObjectURL(res.data))
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
                            <div className={styles.profilePic}>
                                <div className={styles.pic} style={{backgroundImage: `url('${imageURL}')`}}></div>
                                {owner ? <div className={styles.inputIcon} onClick={inputClick}><BiSolidEdit /><input name="profilePic" type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} /></div>
                                    : ""}
                            </div>
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
                                        return <tr onClick={() => {navigate(`/quiz/${quiz.id}/play`)}} className={styles.quizes}>
                                            <td className={styles.quizName}><div>{quiz.name}</div> {quiz.visibility === "private" ? <div className={styles.private}><p>Private</p></div> : ""}</td>
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
                                <h2>{ owner ? "Friend Requests" : "Send Friend Request"}</h2>
                                <div className={styles.friendBox}>
                                <FriendBox userId={ownerDetails.userID} friendId={profileDetails.id} status={friendStatus} fullName={profileDetails.fullName} setStatus={setFriendStatus} />
                                </div>
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