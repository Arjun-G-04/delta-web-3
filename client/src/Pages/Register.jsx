import { Formik, Form, Field, ErrorMessage } from "formik"
import styles from "../styles/Register.module.css"
import * as Yup from "yup"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom' 

export default function Register(){
    const [usernames, setUsernames] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCreated, setIsCreated] = useState(false)
    const navigate = useNavigate()
    useEffect(getUsernames, [])
    useEffect(() => {
        if (isCreated === true) {
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    }, [isCreated])

    const initialValues = {
        fullName:"",
        username:"",
        password:"",
        passwordAgain:""
    }

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required("Please enter your full name"),
        username: Yup.string().required("Please enter username")
        .notOneOf(usernames, "Sorry, username already taken"),
        password: Yup.string().required("Please enter password")
        .min(7, "Password must be atleast 7 characters")
        .max(20, "Password can contain atmost 20 characters")
        .matches(/[0-9]/, "Password must contain a number"),
        passwordAgain: Yup.string().oneOf([Yup.ref('password')], "Both passwords should match")
    })

    function getUsernames() {
        axios.get('http://localhost:3001/usernames')
            .then((res) => {
                let listOfUsernames = []
                res.data.map((value, key) => {
                    listOfUsernames.push(value['username'])
                })
                setUsernames(listOfUsernames)
            })
            .catch((error) => {
                console.log("error")
            })
    }

    function onSubmit(data, { resetForm }) {
        delete data.passwordAgain
        resetForm(initialValues)
        setIsLoading(true)
        axios.post("http://localhost:3001/register", data)
            .then((res) => {
                getUsernames()
                setIsLoading(false)
                setIsCreated(true)
            })
            .catch(() => {
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
                <h1>Register</h1>
                <label>Enter your full name</label>
                <Field className={styles.field} name="fullName" placeholder="Full Name"/>
                <ErrorMessage name="fullName" component="div" className={styles.error}/>

                <label>Enter a username</label>
                <Field className={styles.field} name="username" placeholder="Username"/>
                <ErrorMessage name="username" component="div" className={styles.error}/>

                <label>Enter a password</label>
                <Field className={styles.field} name="password" placeholder="Password" type='password'/>
                <ErrorMessage name="password" component="div" className={styles.error}/>

                <label>Enter password again</label>
                <Field className={styles.field} name="passwordAgain" placeholder="Password" type='password'/>
                <ErrorMessage name="passwordAgain" component="div" className={styles.error}/>

                <button type="submit" className={styles.button}>Continue</button>

                <div className={isLoading ? styles.loader : ""}></div>
                {isCreated ? <div className={styles.successful}>Registered Successfully! Redirecting...</div> : <div></div>}
            </Form>
        </Formik>
    </div>
}