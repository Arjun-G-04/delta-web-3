import { Formik, Form, Field, ErrorMessage, validateYupSchema } from "formik"
import * as Yup from "yup"
import { useState, useEffect } from "react"
import axios from 'axios'
import styles from "../styles/Create.module.css"
import { useNavigate } from "react-router-dom"

export default function Questions(props) {
    const baseURL = process.env.REACT_APP_BASE_URL
    const { quizId } = props
    const [num, setNum] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isFinish, setIsFinish] = useState(false)
    const options = {"optionOne":"Option 1", "optionTwo":"Option 2", "optionThree":"Option 3", "optionFour":"Option 4"}
    const navigate = useNavigate()

    const initialValues = {
        question:"",
        optionOne:"",
        optionTwo:"",
        optionThree:"",
        optionFour:"",
        answer:""
    }

    const validationSchema = Yup.object().shape({
        question: Yup.string().required("Please enter a question bro!"),
        optionOne: Yup.string().required("Bro! You missed me!"),
        optionTwo: Yup.string().required("Bro! You missed me!"),
        optionThree: Yup.string().required("Bro! You missed me!"),
        optionFour: Yup.string().required("Bro! You missed me!"),
        answer: Yup.string().required("Dude, choose an answer")
    })

    function onSubmit(data, { resetForm }) {
        setIsLoading(true)
        data["QuizId"] = quizId
        axios.post(baseURL+"/hub/question", data)
            .then((res) => {
                if (isFinish) {
                    navigate("/home")
                } else {
                    setNum(num+1)
                    resetForm(initialValues)
                    setIsLoading(false)
                }
            })
    }

    return <div className={styles.metaBody}>
        <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
        { (props) => (
            <Form className={styles.form}>
                <h1>Question {num}</h1>

                <label><h3>Type your question</h3></label>
                <Field className={styles.field} name="question"/>
                <ErrorMessage name="question" component="div" className={styles.error}/>

                <label><h3>Options</h3></label>
                <div className={styles.options}>
                    <Field className={styles.fieldTwo} name="optionOne"/>
                    <Field type="radio" name="answer" value="optionOne"/>
                </div>
                <ErrorMessage name="optionOne" component="div" className={styles.error}/>

                <div className={styles.options}>
                    <Field className={styles.fieldTwo} name="optionTwo"/>
                    <Field type="radio" name="answer" value="optionTwo"/>
                </div>
                <ErrorMessage name="optionTwo" component="div" className={styles.error}/>

                <div className={styles.options}>
                    <Field className={styles.fieldTwo} name="optionThree"/>
                    <Field type="radio" name="answer" value="optionThree"/>
                </div>
                <ErrorMessage name="optionThree" component="div" className={styles.error}/>

                <div className={styles.options}>
                    <Field className={styles.fieldTwo} name="optionFour"/>
                    <Field type="radio" name="answer" value="optionFour"/>
                </div>
                <ErrorMessage name="optionFour" component="div" className={styles.error}/>

                <label><h3>Selected Answer</h3></label>
                {props.values.answer ? <span className={styles.answer}>{`${options[props.values.answer]} - ${props.values[props.values.answer]}`}</span>
                    : "" }
                <ErrorMessage name="answer" component="div" className={styles.error}/>
            
                {isLoading ? "" : <div>
                    <button onClick={()=>{ setIsFinish(true) }} className={styles.finish} type="submit">Finish Quiz</button>
                    <button className={styles.new} type="submit">Another Question</button>
                    </div>}

                <div className={isLoading ? styles.loader : ""}></div>
            </Form>
        )
        }
        </Formik>
    </div>
}