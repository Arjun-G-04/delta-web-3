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
    if (req.userID === -1) {
        res.json({auth: false})
    } else {
        const username = req.params.username
        const currentUser = await User.findOne({where: {id: req.userID}})
        const viewUser = await User.findOne({where: {username: username}})

        const quizes = await Quiz.findAll({where: {UserId: viewUser.id}}) 

        if (currentUser.id === viewUser.id) {
            res.json({auth: true, owner: true, fullName: viewUser.fullName, quizes: quizes})
        } else {
            res.json({auth: true, owner: false, fullName: viewUser.fullName, quizes: quizes})
        }
    }
})

module.exports = router