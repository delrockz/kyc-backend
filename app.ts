import apiRoutes from './routes'
const cors = require('cors')

const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
app.use(cookieParser())

var mongooseConnection
;(async () => {
  const mongoose = require('mongoose')

  // Setting up Connection if not already exists.
  if (!mongooseConnection) {
    // Wait for the connection to MongoDB To Establish.
    mongooseConnection = await mongoose.connect(process.env.DBPath || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected To MongoDB.')
  }

  return mongooseConnection
})()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true }))
app.use('/api', apiRoutes)

const port = process.env.PORT || 5000
app.listen(port)
