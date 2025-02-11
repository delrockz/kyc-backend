import { Request, Response } from 'express'
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession
} from 'amazon-cognito-identity-js'
import { USER_POOL_ID } from '../utils/aws-config'
import User from '../models/User'
import KycApplication from '../models/KycApplication'

var userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: process.env.AWS_USER_POOL_APP_CLIENT_ID ?? ''
})

export const signupUser = async (req: Request, res: Response, next: () => void) => {
  const { email, password, userType = 'User' }: { email: string; password: string; userType: string } = req.body

  if (!email || !password) return res.status(400).json({ error: 'Missing required fields' })

  userPool.signUp(
    email,
    password,
    [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'custom:user_type', Value: userType })
    ],
    [],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message || JSON.stringify(err) })

      try {
        await User.create({
          email,
          userType
        })
        return res.status(200).json({ data: `Signed up successfully.` })
      } catch (err: any) {
        return res.status(500).json({ error: err.message })
      }
    }
  )
}

export const loginUser = async (req: Request, res: Response, next: () => void) => {
  try {
    const { email, password }: { email: string; password: string } = req.body
    if (!email) return res.status(400).json({ error: "'email' required." })
    if (!password) return res.status(400).json({ error: "'password' required." })

    let Username = email
    var cognitoUser = new CognitoUser({
      Username,
      Pool: userPool
    })
    cognitoUser.authenticateUser(
      new AuthenticationDetails({
        Username,
        Password: password
      }),
      {
        async onSuccess(session: CognitoUserSession) {
          const user = await User.findOne({ email })
          const linkedKycApplication = await KycApplication.findOne({ user: user?._id }).populate('user', 'email')
          return res.status(200).json({
            data: {
              accessToken: session.getAccessToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
              idToken: session.getIdToken().getJwtToken(),
              user,
              kycApplication: linkedKycApplication
            }
          })
        },
        onFailure(err) {
          if (err) return res.status(403).json({ error: err.message || JSON.stringify(err) })
        }
      }
    )
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
