import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  jobPostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobLocation: {
    type: String,
    required: true
  },
  jobSalaryRange: {
    type: String
  },
  jobSkills: [{
    type: String,
    required: true
  }],
  jobCategory: {
    type: String,
    enum: ['full-time', 'part-time', 'contract']
  },
  jobShift: {
    type: String,
    enum: ['morning', 'night', 'custom']
  },
  jobKeyRes: [{
    type: String,
    required: true
  }],
  jobReqQual: [{
    type: String,
    required: true
  }],
  jobFullAddress: {
    type: String
  },
  jobIntType: {
    type: String,
    enum: ['in-person', 'online']
  },
  jobType: {
    type: String,
    enum: ['in-office', 'hybrid', 'remote']
  }
}, {timestamps: true, strict: true});

const Job = mongoose.model('Job', JobSchema);

export default Job;