import { authenticate } from './middleware/auth'
import { approveKyc, getKycDashboard, getKycApplications, rejectKyc, submitKyc } from './controllers/KYCController'
import { loginUser, signupUser } from './controllers/UserController'
import { adminAuthenticate } from './middleware/adminAuth'

const express = require('express')
const router = express.Router()

// Auth APIs
router.post('/signup', signupUser)
router.post('/login', loginUser)

// User APIs
router.post('/submitKyc', authenticate, submitKyc)

// Admin APIs
router.get('/kycapplications', adminAuthenticate, getKycApplications)
router.get('/kycdashboard', adminAuthenticate, getKycDashboard)
router.put('/approveKyc/:id', adminAuthenticate, approveKyc)
router.put('/rejectKyc/:id', adminAuthenticate, rejectKyc)

export default router
