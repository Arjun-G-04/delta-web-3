// Express and database
const express = require('express')
const app = express()
const db = require('./models')
const cors = require("cors")

app.use(express.json())
app.use(cors())

// Routers
const manageAccountsRouter = require("./routes/manageAccounts")
app.use("", manageAccountsRouter)

const userHubRouter = require("./routes/userHub")
app.use("/hub", userHubRouter)

// Sync tables and start the server
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server has started!")
    })
})