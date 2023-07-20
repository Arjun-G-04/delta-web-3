import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "../styles/QuizView.module.css"
import Loading from "./Loading"
import QuestionPlay from "./QuestionPlay"
import axios from "axios"

export default function QuizView() {
    const baseURL = process.env.REACT_APP_BASE_URL
    const navigate = useNavigate()

    const { quizID } = useParams()
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState(false)
    const [userID, setUserID] = useState(null)
    const [pageNo, setPageNo] = useState(0)
    const [quizData, setQuizData] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [score, setScore] = useState(0)

    useEffect(() => {
        checkAuth()
        getQuizData()
    }, [])

    useEffect(() => {
        if (quizData != null && pageNo > 0) {
            if (pageNo <= quizData.questions.length) {
                setCurrentQuestion(quizData.questions[pageNo-1])
            } else {
                const data = {score: score, QuizId: quizID, UserId: userID, maxScore: quizData.questions.length}
                axios.post(baseURL+"/hub/quiz/score", data)
                setCurrentQuestion("over")
            }
        }
    }, [pageNo])

    function checkAuth() {
        axios.get(baseURL+"/hub/home", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((res) => {
                setAuth(res.data.auth)
                setUserID(res.data.userID)
            })
    }

    function getQuizData() {
        axios.get(baseURL+`/hub/quiz/${quizID}`)
            .then((res) => {
                setQuizData(res.data)
                setLoading(false)
            })
    }

    function startQuiz() {
        setPageNo(1)
    }

    function incScore() {
        setScore(score + 1)
    }

    function incPageNo() {
        setPageNo(pageNo + 1)
    }

    if (loading) {
        return <Loading />
    } else {
        if (auth) {
            if (quizData.quiz) {
                if (currentQuestion === null) {
                    return <div className={styles.body}>
                        <div className={styles.quizBody}>
                            <div className={styles.insideQuizBody}>
                                <h1>{quizData.name}</h1>
                                <h2>Created By {quizData.author}</h2>
                                <p>Total number of questions: {quizData.questions.length}</p>
                                <span onClick={startQuiz}>Start Quiz</span>
                            </div>
                        </div>
                    </div>
                } else if (currentQuestion === "over") {
                    return <div className={styles.body}>
                        <div className={styles.quizBody}>
                        <div className={styles.insideResultBody}>
                                <h1>Score</h1>
                                <h2>{score} out of {quizData.questions.length}</h2>
                                <h2>{`${Math.round((score/quizData.questions.length)*100)}%`}</h2>
                                <span onClick={() => { navigate(-1) }}>Go Back</span>
                            </div>
                        </div>
                    </div>
                } else {
                    return <div className={styles.body}>
                        <div className={styles.quizBody}>
                                <QuestionPlay question={currentQuestion} pageNo={pageNo} incPageNo={incPageNo} incScore={incScore}/>
                        </div>
                    </div>
                }
            } else {
                return <div className={styles.body}>
                    <div className={styles.quizBody}>
                        <div className={styles.insideQuizBody}>
                            <h1>Quiz Not Found :/</h1>
                        </div>
                    </div>
                </div>
            }
        } else {
            navigate("/")
        }
    }
}