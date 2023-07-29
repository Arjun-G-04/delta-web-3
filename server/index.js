// Express and database
// gcloud sql connect delta-web-3-db --user=root
const express = require('express')
const app = express()
const db = require('./models')
const cors = require("cors")
const bodyParser = require('body-parser')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

// "dialectOptions": {
    //   "socketPath": "./cloudsql/wise-diagram-392116:us-central1:delta-web-3-db"
    // }