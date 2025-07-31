import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  companyName: {
    type: String
  },
  userEmail: {
    type: String
  },
  userContactNumber: {
    type: Number
  },
  userRole: {
    type: String,
  },
  password: {
    type: String,
    minLength: 6
  },
  isUserVerified: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', UserSchema);

export default User;