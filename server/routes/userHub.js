const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { Users } = require('../models')

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
    const user = await Users.findOne({ where: {id: req.userID}})
    res.json({auth: true, userID: req.userID, fullName: user.fullName})
})

module.exports = router