import { Types } from 'mongoose'

export enum UserType {
  Admin = 'Admin',
  User = 'User'
}
export interface IUser {
  email: string
  userType: UserType
  _id: Types.ObjectId
}
