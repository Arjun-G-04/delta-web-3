// import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"

export default function Home() {
  const baseURL = process.env.REACT_APP_BASE_URL
  const [isAuth, setIsAuth] = useState(false)
  const navigate = useNavigate()

  axios.get(baseURL + `/hub/home`, {
    headers: {
        "x-access-token": localStorage.getItem('token')
    }
  })
    .then((res) => {
        if (res.data.auth) {
            setIsAuth(true)
        }
    })
  
  if (isAuth) {
    navigate("/home")
  } else {
    return <div id="body">
      <div className={styles.header}>
        <div className={styles.titleAndButtons}>
          <h1>Quizzy Fun Awaits!</h1>
          <div>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </div>
        <div className={styles.titleImageBackground}>
          <div></div>
        </div>
      </div>
    </div>
  }
}