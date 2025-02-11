import { Types } from 'mongoose'
import AWS from 'aws-sdk'
import path from 'path'
import { AWS_CONFIG } from './aws-config'

const s3 = new AWS.S3(AWS_CONFIG)

export const uploadToS3 = async (uid: Types.ObjectId, file: Express.Multer.File): Promise<string> => {
  const fileExtension = path.extname(file.originalname)
  const fileName = `${uid}${fileExtension}`

  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `kyc-app/id-documents/${fileName}`,
    Body: Buffer.from(file.buffer),
    ContentType: file.mimetype
  }

  try {
    const uploadResult = await s3.upload(params).promise()
    return uploadResult.Location
  } catch (error) {
    throw new Error('File upload failed')
  }
}
