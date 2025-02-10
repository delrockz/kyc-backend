import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: ''
    },
    userType: {
      type: String,
      enum: ['Admin', 'User']
    }
  },
  { timestamps: true }
)

const User = mongoose.model('users', UserSchema)
export default User
