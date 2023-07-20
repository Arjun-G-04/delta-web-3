import { useState, useEffect } from 'react'
import styles from '../styles/History.module.css'
import axios from 'axios'

export default function List(props) {
  const baseURL = process.env.REACT_APP_BASE_URL
  const { quizzes } = props
  const [quizDetails, setQuizDetails] = useState({})

  useEffect(() => {
    for (const date in quizzes) {
      quizzes[date].forEach((score) => {
        axios.get(baseURL+`/hub/quiz/meta/${score.quizID}`)
          .then((res) => {
            if (!(score.quizID in quizDetails)) {
              const details = {...quizDetails}
              details[score.quizID] = res.data.name
              setQuizDetails(details)
            }
          })
      })
    }
  }, [quizzes, quizDetails])

  if (quizzes === null) {
    return <h3>No Quizzes Taken Yet</h3>
  } else {
    const dates = Object.keys(quizzes)

    return <div>
      { dates.map((date) => {
        return <div className={styles.date}>
          <h2>{date}</h2>
          <table>
          <tbody>
            <tr>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>Max Score</th>
              <th>Time</th>
            </tr>
            {quizzes[date].map((score) => {
              return <tr className={styles.entry}>
              <td>{quizDetails[score.quizID]}</td>
              <td>{score.score}</td>
              <td>{score.maxScore}</td>
              <td>{score.time}</td>
              </tr>
            })}
            </tbody>
          </table>
        </div>
      }) }
    </div>
  }
}