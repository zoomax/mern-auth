const express = require('express')
const logger = require('morgan')
const bodyparser = require('body-parser')
const userRouter = require('./routes/user')
const dbConnection = require('./utils/dbConnection')
const dotenv = require('dotenv')
const cors = require('cors')
dbConnection()

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
if (app.get('env') == 'development') {
  dotenv.config()
}
const passport = require('passport')
const authHelper = require('./utils/authHelper')

//middlewares
app.use(logger('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
//routes
app.use('/users', userRouter)

// runnong the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
