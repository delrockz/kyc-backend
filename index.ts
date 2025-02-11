// This file will act as the entry point for serverless lambda/function, refer app.ts for local development server
import { APIGatewayProxyHandler } from 'aws-lambda'
import { Request, Response } from 'express'
import ServerlessHttp from 'serverless-http'
import apiRoutes from './routes'

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
require('dotenv').config()

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

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: () => void) => {
  res.append('Access-Control-Allow-Origin', ['*'])
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.append('Access-Control-Allow-Headers', ['*'])
  next()
})
app.use('/api', apiRoutes)

export const handler: APIGatewayProxyHandler = ServerlessHttp(app) as APIGatewayProxyHandler
