const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require("path")
const fs = require("fs")
const { User, Quiz, Question, Score, Friend } = require('../models')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("images/"))
    },
    filename: (req, file, cb) => {
        const username = req.params.username
        const fileName = `${username}.png`
        cb(null, fileName)
    }
})

const upload = multer({storage: storage})

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
            res.json({auth: true, owner: true, fullName: viewUser.fullName, id: viewUser.id, quizes: quizes})
        } else {
            res.json({auth: true, owner: false, fullName: viewUser.fullName, id: viewUser.id, quizes: quizes})
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

router.get("/quiz/meta/:id", async (req, res) => {
    const id = req.params.id
    const quiz = await Quiz.findOne({where: {id: id}})

    if (quiz === null) {
        res.json({quiz: false})
    } else {
        const author = await User.findOne({where: {id: quiz.UserId}})
        res.json({quiz: true, name: quiz.name, author: author.fullName})
    }
})

router.post("/quiz/score", async(req, res) => {
    const data = req.body
    const score = await Score.create(data)
    res.json({status:"done"})
})

router.get("/history/:id", async(req, res) => {
    const userID = req.params.id
    const scores = await Score.findAll({where: {UserId: userID}})
    const resJSON = {}

    scores.forEach((score) => {
        const date = score.createdAt.toLocaleDateString('en-GB')
        const time = score.createdAt.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
        const quizID = score.QuizId

        if (date in resJSON) {
            resJSON[date].push({time: time, score: score.score, maxScore: score.maxScore, quizID: quizID})
        } else {
            resJSON[date] = [{time: time, score: score.score, maxScore: score.maxScore, quizID: quizID}]
        }
    });

    if (scores === null) {
        res.json({isNull: true})
    } else {
        res.json(resJSON)
    }
})

router.post("/upload/:username", upload.single("profilePic"), (req, res) => {
    return res.json({status: "done"})
})

router.get("/profilePic/:username", (req, res) => {
    const username = req.params.username
    const filePath = path.resolve(`images/${username}.png`)

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.sendFile(path.resolve(`images/defaultProfilePic.png`))
    }
})

router.post("/friendRequest", async(req, res) => {
    await Friend.create(req.body)
    res.json({status: "done"})
})

router.get("/friendCheck/:userId/:friendId", async(req, res) => {
    const userId = req.params.userId
    const friendId = req.params.friendId

    const record = await Friend.findOne({where: {userId: userId, friendId: friendId}})

    if (record === null) {
        res.json({status: "request"})
    } else {
        if (record.status === "requested") {
            res.json({status: "requested"})
        } else if (record.status === "accepted") {
            res.json({status: "accepted"})
        }
    }
})

router.get("/requestCheck/:friendId", async(req, res) => {
    const friendId = req.params.friendId
    const requests = await Friend.findAll({where: {friendId: friendId, status: "requested"}})
    let output = []

    for (i = 0 ; i < requests.length ; i++) {
        const user = await User.findOne({where: {id: requests[i].userId}})
        output.push({username: user.username, reqId: requests[i].id})
    }
    
    res.json({requests: output})
})

router.get("/requestUpdate/:id/:status", async(req, res) => {
    const status = req.params.status
    const id = req.params.id
    const request = await Friend.findOne({where: {id: id}})
    await Friend.update({status: status}, {where: {id: id}})

    const alreadyExist = await Friend.findOne({where: {userId: request.friendId, friendId: request.userId}})
    console.log(alreadyExist)
    if (alreadyExist) {
        Friend.update({status: status}, {where: {userId: request.friendId, friendId: request.userId}})
    } else {
        await Friend.create({userId: request.friendId, friendId: request.userId, status: "accepted"})
    }

    res.json({status: "done"})
})

router.get("/friends/:id", async(req, res) => {
    const id = req.params.id
    const friends = await Friend.findAll({where: {userId: id, status: "accepted"}})
    let output = []

    if (friends) {
        for (i = 0 ; i < friends.length ; i++) {
            const friend = await User.findOne({where: {id: friends[i].friendId}})
            output.push({name: friend.fullName, username: friend.username})
        }
    }

    res.json({output: output})
})

module.exports = router