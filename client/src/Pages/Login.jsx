import { Formik, Form, Field, ErrorMessage } from "formik"
import styles from "../styles/Login.module.css"
import * as Yup from "yup"

export default function Login(){

    const initialValues = {
        username:"",
        password:""
    }

    function onSubmit(data) {
        console.log(data)
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Please enter username"),
        password: Yup.string().required("Please enter password")
    })

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
            </Form>
        </Formik>
    </div>
}