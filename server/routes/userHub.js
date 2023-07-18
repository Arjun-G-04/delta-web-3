const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { User, Quiz, Question } = require('../models')

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        req.auth = false
        req.userID = -1
        next()
    } else {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                req.auth = false
                req.userID = -1
                next()
            } else {
                req.auth = true
                req.userID = decoded.id
                next()
            }
        })
    }
}

router.get("/isAuth", verifyJWT, async(req, res) => {
    res.json({auth: req.auth})
})

router.get("/home", verifyJWT, async (req, res) => {
    if (req.auth) {
        const user = await User.findOne({ where: {id: req.userID}})
        res.json({auth: true, userID: req.userID, fullName: user.fullName, username: user.username})
    } else {
        res.json({auth: false})
    }
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

router.get("/profile/:username", verifyJWT, async (req, res) => {
    const username = req.params.username
    const viewUser = await User.findOne({where: {username: username}})
    if (req.userID === -1 || viewUser === null) {
        res.json({auth: false})
    } else {
        const currentUser = await User.findOne({where: {id: req.userID}})

        const quizes = await Quiz.findAll({where: {UserId: viewUser.id}}) 

        if (currentUser.id === viewUser.id) {
            res.json({auth: true, owner: true, fullName: viewUser.fullName, quizes: quizes})
        } else {
            res.json({auth: true, owner: false, fullName: viewUser.fullName, quizes: quizes})
        }
    }
})

router.get("/quiz/:id", async (req, res) => {
    const id = req.params.id
    const quiz = await Quiz.findOne({where: {id: id}})

    if (quiz === null) {
        res.json({quiz: false})
    } else {
        const author = await User.findOne({where: {id: quiz.UserId}})
        const questions = await Question.findAll({where: {QuizId: id}})
        res.json({quiz: true, name: quiz.name, author: author.fullName, questions: questions})
    }
})

module.exports = router