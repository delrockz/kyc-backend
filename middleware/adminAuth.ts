import { Response } from 'express'
import { IRequestWithUser } from '../interfaces/IRequestWithUser'
import { authenticate } from './auth'

export const adminAuthenticate = async (req: IRequestWithUser, res: Response, next: () => void) => {
  try {
    authenticate(req, res, () => {
      if (req.user?.userType !== 'Admin') return res.status(401).json({ error: 'Unauthorized' })
      next()
    })
  } catch (err: any) {
    console.log(err)
    if (err) return res.status(401).json({ error: err.message || JSON.stringify(err) })
  }
}
