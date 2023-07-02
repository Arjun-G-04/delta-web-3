import { Formik, Form, Field, ErrorMessage } from "formik"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../styles/Login.module.css"
import * as Yup from "yup"
import axios from 'axios'

export default function Login(){
    const baseURL = process.env.REACT_APP_BASE_URL
    const [listOfUsers, setListOfUsers] = useState([])
    const [isWrongPass, setIsWrongPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const initialValues = {
        username:"",
        password:""
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Please enter username")
            .oneOf(listOfUsers, "Username does not exist"),
        password: Yup.string().required("Please enter password")
    })

    useEffect(getUsernames, [])

    function onSubmit(data) {
        setIsWrongPass(false)
        setIsLoading(true)
        axios.post(baseURL+"/login", data)
            .then((res) => {
                setIsLoading(false)
                if (res.data.auth) {
                    setIsWrongPass(false)
                    localStorage.setItem('token', res.data.token)
                    navigate("/home")
                } else {
                    setIsWrongPass(true)
                }
            })
            .catch(() => {
                setIsLoading(false)
                console.log("error")
            })
    }

    function getUsernames() {
        axios.get('http://localhost:3001/usernames')
            .then((res) => {
                let listOfUsernames = []
                listOfUsernames = res.data.map((value, key) => {
                    return value['username']
                })
                setListOfUsers(listOfUsernames)
            })
            .catch((error) => {
                console.log("error")
            })
    }

    return <div className={styles.loginApp}>
        <Formik 
            initialValues={initialValues} 
            onSubmit={onSubmit} 
            validationSchema={validationSchema}
        >
            <Form className={styles.form}>
                <h1>Login</h1>
                <label>Enter username</label>
                <Field className={styles.field} id="usernameField" name="username" placeholder="Username"/>
                <ErrorMessage name="username" component="div" className={styles.error}/>

                <label>Enter Password </label>
                <Field className={styles.field} id="passwordField" name="password" placeholder="Password" type='password'/>
                <ErrorMessage name="password" component="div" className={styles.error}/>

                <button type="submit" className={styles.button}>Continue</button>

                <div className={isLoading ? styles.loader : ""}></div>
                { isWrongPass ? <div className={styles.passError}>Incorrect password, Please try again!</div> : <div></div> }
            </Form>
        </Formik>
    </div>
}