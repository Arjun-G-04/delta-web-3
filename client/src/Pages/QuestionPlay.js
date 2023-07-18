import { Formik, Form, Field, ErrorMessage, validateYupSchema } from "formik"
import * as Yup from "yup"
import { useState, useEffect } from "react"
import styles from "../styles/QuestionPlay.module.css"

export default function QuestionPlay(props) {
    const { question, pageNo, incPageNo, incScore } = props

    const initialValues = {
        answer: ""
    }

    const validationSchema = Yup.object().shape({
        answer: Yup.string().required("Please select an answer")
    })

    function onSubmit(data, { resetForm }) {
        resetForm()
        if (data.answer === question.answer) {
            incScore()
        }
        incPageNo()
    }

    return <div>
        <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form className={styles.form}>
                <h1>Question {pageNo}</h1>

                <h3>{question.question}</h3>
                <h4>Options</h4>
                <div className={styles.options}>
                    <Field type="radio" name="answer" value="optionOne"/>
                    <p>{question.optionOne}</p>
                </div>

                <div className={styles.options}>
                    <Field type="radio" name="answer" value="optionTwo"/>
                    <p>{question.optionTwo}</p>
                </div>

                <div className={styles.options}>
                    <Field type="radio" name="answer" value="optionThree"/>
                    <p>{question.optionThree}</p>
                </div>

                <div className={styles.options}>
                    <Field type="radio" name="answer" value="optionFour"/>
                    <p>{question.optionFour}</p>
                </div>

                <ErrorMessage name="answer" component="div" className={styles.error}/>

                <div>
                    <button className={styles.next} type="submit">Next</button>
                </div>
            </Form>
        </Formik>
    </div>
}