import mongoose from 'mongoose'

const KycApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    phone: {
      type: String
    },
    idDocumentUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: true
    }
  },
  { timestamps: true }
)

const KycApplication = mongoose.model('kycapplications', KycApplicationSchema)
export default KycApplication
