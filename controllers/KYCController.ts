import { Request, Response } from 'express'
import { IRequestWithUser } from '../interfaces/IRequestWithUser'
import KycApplication from '../models/KycApplication'
import multer from 'multer'
import { uploadToS3 } from '../utils/uploadFile'

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
