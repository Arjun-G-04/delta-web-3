import { Formik, Form, Field, ErrorMessage, validateYupSchema } from "formik"
import * as Yup from "yup"
import { useState, useEffect } from "react"
import axios from 'axios'
import styles from "../styles/Create.module.css"

export default function Meta(props) {
    const baseURL = process.env.REACT_APP_BASE_URL
    const { setPage, setQuizId, userId } = props
    const [isLoading, setIsLoading] = useState(false)
    const initialValues = {
        name:"",
        visibility:"public",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Please enter the name of the quiz"),
    })

    function onSubmit(data) {
        data["UserId"] = userId
        axios.post(baseURL+"/hub/meta", data)
            .then((res) => {
                setQuizId(res.data.quizId)
                setPage(1)
            })
    }

    return <div className={styles.metaBody}>
        <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form className={styles.form}>
                <h1>New Quiz</h1>

                <label><h3>Quiz Name</h3></label>
                <Field className={styles.field} name="name"/>
                <ErrorMessage name="name" component="div" className={styles.error}/>

                <label><h3>Visibility</h3></label>
                <div className={styles.options}>
                    <Field type="radio" className={styles.field} name="visibility" value="public"/>
                    <span className={styles.field}>Public</span>
                </div>
                <div className={styles.options}>
                    <Field type="radio" className={styles.field} name="visibility" value="private"/>
                    <span className={styles.field}>Private</span>
                </div>

                {isLoading ? "" : <button type="submit">Next</button>}

                <div className={isLoading ? styles.loader : ""}></div>
            </Form>
        </Formik>
    </div>
}