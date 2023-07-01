import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Link } from "react-router-dom"

export default function Home() {

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