const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

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

router.get("/home", verifyJWT, (req, res) => {
    res.json({auth: true, userID: req.userID})
})

module.exports = router