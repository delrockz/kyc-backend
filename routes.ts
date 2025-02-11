import { submitKyc } from './controllers/KYCController'
import { authenticate } from './middleware/auth'
import { loginUser, signupUser } from './controllers/UserController'

const express = require('express')
const router = express.Router()

// Auth APIs
router.post('/signup', signupUser)
router.post('/login', loginUser)

// User APIs
router.post('/submitKyc', authenticate, submitKyc)

export default router
