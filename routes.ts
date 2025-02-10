import { loginUser, signupUser } from './controllers/UserController'

const express = require('express')
const router = express.Router()

// Auth APIs
router.post('/signup', signupUser)
router.post('/login', loginUser)

export default router
