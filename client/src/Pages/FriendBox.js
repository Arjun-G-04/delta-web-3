import axios from "axios"
import { useEffect, useState } from "react"
import styles from "../styles/FriendBox.module.css"

export default function FriendBox(props) {
    const {fullName, status, userId, friendId, setStatus} = props
    const baseURL = process.env.REACT_APP_BASE_URL
    const [requests, setRequests] = useState([])

    useEffect(() => {
        getInitialData()
    }, [userId, friendId])

    function getInitialData() {
        if (userId != friendId) {
            axios.get(baseURL+`/hub/friendCheck/${userId}/${friendId}`)
                .then((res) => {
                    setStatus(res.data.status)
                })
        } else {
            axios.get(baseURL+`/hub/requestCheck/${userId}`)
                .then((res) => {
                    setRequests(res.data.requests)
                })
            setStatus("owner")
        }
    }

    function sendRequest() {
        axios.post(baseURL+"/hub/friendRequest", {userId: userId, friendId: friendId, status: "requested"})
            .then((res) => {
                setStatus("requested")
            })
    }

    function friendAccept(reqId) {
        axios.get(baseURL+`/hub/requestUpdate/${reqId}/accepted`)
            .then((res) => {
                getInitialData()
            })
    }

    function friendDeny(reqId) {
        axios.get(baseURL+`/hub/requestUpdate/${reqId}/denied`)
            .then((res) => {
                getInitialData()
            })
    }

    if (status === "request") {
        return <div className={styles.friendInfo}>
                <p>Send friend request to {fullName}</p>
                <button onClick={sendRequest}>Send</button>
        </div>
    } else if (status === "requested") {
        return <div className={styles.friendInfo}>
            <p>You have sent friend request!</p>
        </div>
    } else if (status === "accepted") {
        return <div className={styles.friendInfo}>
            <p>You are friends with {fullName}</p>
        </div>
    } else if (status === "owner") {
        if (requests.length === 0) {
            return <div className={styles.friendInfo}>
                <p>You have no friend requests currently!</p>
            </div>
        } else {
            return <div>
                {requests.map((req) => {
                    return <div className={styles.requestRow}>
                        <p>{req.username}</p>
                        <div>
                            <button onClick={() => friendAccept(req.reqId)}>accept</button>
                            <button onClick={() => friendDeny(req.reqId)}>deny</button>
                        </div>
                    </div>
                })}
            </div>
        }
    }
}