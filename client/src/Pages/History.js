import { useState, useEffect } from 'react'
import styles from '../styles/History.module.css'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import MenuBar from './MenuBar'
import Header from './Header'
import Loading from './Loading'
import List from './List'

export default function History() {
  const baseURL = process.env.REACT_APP_BASE_URL
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [quizzes, setQuizzes] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
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
              setIsLoading(false)
          } else {
              setIsLoading(false)
          }
      })
  }, [])

  useEffect(() => {
    if (userDetails != null) {
      axios.get(baseURL+`/hub/history/${userDetails.userID}`)
        .then((res) => {
          if (Object.keys(res.data).length === 0) {
            setQuizzes(null)
          } else {
            setQuizzes(res.data)
          }
        })
    }
  }, [userDetails])

  if (isLoading) {
    return <Loading />
  } else if (isAuth) {
    return <div className={styles.body}>
      <MenuBar loc="history"/>
      <div className={styles.allItems}>
        <Header name={userDetails.fullName} username={userDetails.username} />
        <div className={styles.history}>
          <div className={styles.insideHistory}>
            <h1>History</h1>
            <List quizzes={quizzes}/>
          </div>
        </div>
      </div>
    </div>
  } else {
    navigate("/")
  }
}