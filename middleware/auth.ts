import { AttributeType } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { Response } from 'express'
import { IRequestWithUser } from '../interfaces/IRequestWithUser'
import User from '../models/User'
import { IUser } from '../interfaces/IUser'

const axios = require('axios')
const COGNITO_URL = `https://cognito-idp.ap-south-1.amazonaws.com/`

export const authenticate = async (req: IRequestWithUser, res: Response, next: () => void) => {
  try {
    const accessToken = req.header('Authorization')
    if (!accessToken || !accessToken.includes('Bearer')) return res.status(401).json({ error: 'Unauthorized' })
    const { data } = await axios.post(
      COGNITO_URL,
      {
        AccessToken: accessToken.split(' ')[1]
      },
      {
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser'
        }
      }
    )

    let user = await User.findOne({
      email: data.UserAttributes.filter((data: AttributeType) => data.Name === 'email')[0].Value
    })
    if (user) req.user = user as IUser
    next()
  } catch (err: any) {
    console.log(err)
    if (err) return res.status(401).json({ error: err.message || JSON.stringify(err) })
  }
}
