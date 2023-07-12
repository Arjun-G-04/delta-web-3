import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState, useEffect, Redirect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import styles from "../styles/Create.module.css"
import Meta from "./Meta"
import Loading from "./Loading"
import Questions from "./Questions"

export default function Create() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const [userId, setUserId] = useState(null) 
    const [page, setPage] = useState(0)
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const [quizId, setQuizId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(baseURL+'/hub/home', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.data.auth) {
                    setUserId(res.data.userID)
                    setIsAuth(true)
                    setLoading(false)
                }
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    if (isAuth) {
        if (page === 0) {
            return <div className={styles.body}>
                <Meta setPage={setPage} setQuizId={setQuizId} userId={userId} />
            </div>
        } else {
            return <div className={styles.body}>
                <Questions quizId={quizId} />
            </div>
        }
    } else {
        if (loading) {
            return <div>
                <Loading />
            </div>
        } else {
            navigate("/")
        }
    }
}