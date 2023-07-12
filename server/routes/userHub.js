const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { User, Quiz, Question } = require('../models')

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        res.json({auth: false})
    } else {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                res.json({auth: false})
            } else {
                req.userID = decoded.id
                next()
            }
        })
    }
}

router.get("/home", verifyJWT, async (req, res) => {
    const user = await User.findOne({ where: {id: req.userID}})
    res.json({auth: true, userID: req.userID, fullName: user.fullName})
})

router.post("/meta", async (req, res) => {
    const metaData = req.body
    const quiz = await Quiz.create(metaData)
    res.json({quizId:quiz.id})
})

router.post("/question", async (req, res) => {
    const data = req.body
    const question = await Question.create(data)
    res.json({status:"done"})
})

module.exports = router