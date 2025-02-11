import { Request, Response } from 'express'
import { IRequestWithUser } from '../interfaces/IRequestWithUser'
import KycApplication from '../models/KycApplication'
import multer from 'multer'
import { uploadToS3 } from '../utils/uploadFile'
import User from '../models/User'

const storage = multer.memoryStorage()
const upload = multer({ storage }).single('idDocumentImage')

export const submitKyc = async (req: IRequestWithUser, res: Response, next: () => void) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: 'File upload failed' })

    const linkedKycApplication = await KycApplication.findOne({ user: req.user._id })
    if (linkedKycApplication)
      return res
        .status(400)
        .json({ error: `KYC details already submitted. Status is '${linkedKycApplication.status}'.` })

    const { firstName, lastName, phone }: { firstName: string; lastName: string; phone: number } = req.body
    if (!firstName || !lastName || !phone || !req.file)
      return res.status(400).json({ error: 'Missing required fields' })

    try {
      const fileUrl = await uploadToS3(req.user._id, req.file)

      const kycApplication = await KycApplication.create({
        firstName,
        lastName,
        phone,
        idDocumentUrl: fileUrl,
        user: req.user._id
      })

      return res.status(200).json({ data: { ...kycApplication.toJSON(), user: req.user } })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  })
}

export const getKycApplications = async (req: Request, res: Response) => {
  const { status } = req.query

  const filter: any = {}
  if (status) filter.status = status

  try {
    const documents = await KycApplication.find(filter).populate('user', 'email')
    return res.status(200).json({ data: documents })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}

export const approveKyc = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await KycApplication.findByIdAndUpdate(id, { status: 'approved' })
    return res.status(200).json({ message: 'KYC approved' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}

export const rejectKyc = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await KycApplication.findByIdAndUpdate(id, { status: 'rejected' })
    return res.status(200).json({ message: 'KYC rejected' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}

export const getKycDashboard = async (req: Request, res: Response) => {
  try {
    const [nUsers, kycStats] = await Promise.all([
      User.countDocuments(),
      KycApplication.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ])

    return res.status(200).json({
      data: {
        nUsers: nUsers,
        nPending: kycStats.find((s) => s._id === 'pending')?.count || 0,
        nApproved: kycStats.find((s) => s._id === 'approved')?.count || 0,
        nRejected: kycStats.find((s) => s._id === 'rejected')?.count || 0
      }
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
