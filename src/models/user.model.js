import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userContactNumber: {
    type: Number,
    required: true
  },
  userRole: {
    type: String,
    required: true,
    enum: ['employer', 'employee']
  },
  password: {
    type: String,
    minLength: 6,
    required: true
  },
  isUserVerified: {
    type: Boolean,
    default: false
  },
  isUserLoggedIn: {
    type: Boolean,
    default: false
  },
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  postedJobs: [{
    type: mongoose.Schema.Types.ObjectId
  }]
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

export default User;