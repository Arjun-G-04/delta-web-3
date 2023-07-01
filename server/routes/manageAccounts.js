const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')

router.get("/", (req, res) => {
    res.send("Hello World")
})

router.get("/login", async (req, res) => {
    // get login details of people
    allUsers = await Users.findAll()
    res.json(allUsers)
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