const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

router.post("/login", async (req, res) => {
    const userDetails = req.body
    const user = await Users.findOne({ where: {username: userDetails['username']}})

    if (user === null) {
        res.json({auth: false, reason: "noUser"})
    } else {
        bcrypt.compare(userDetails['password'], user['password'], (err, result) => {
            if (result) {
                const id = user['id']
                const token = jwt.sign({id}, jwtSecret, {expiresIn: '24h'})
                res.json({auth: true, token: token, id:id})
            } else {
                res.json({auth: false, reason: "wrongPassword"})
            }
        });
    }
})

router.post("/register", async (req, res) => {
    const userDetails = req.body
    const rawPassword = userDetails['password'] 
    
    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(rawPassword, salt)
    userDetails['password'] = hashedPassword

    // create the new user
    await Users.create(userDetails)
    res.status(201).json({message: 'User created successfully'})
})

router.get("/usernames", async (req, res) => {
    // send list of usernames
    usernames = await Users.findAll({attributes:["username"]})
    res.json(usernames)
})

module.exports = router