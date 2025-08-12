import Job from '../models/job.model.js'
import mongoose from 'mongoose';

export const checkRoute = (req, res) => {
  res.send('route is working');
}

export const PostJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobLocation,
      jobSalaryRange,
      jobSkills,
      jobCategory,
      jobShift,
      jobKeyRes,
      jobReqQual,
      jobFullAddress,
      jobIntType,
      jobType
    } = req.body;

    const user = req.user;

    if (!jobTitle || !jobLocation || !jobSkills || !jobKeyRes || !jobReqQual) {
      return res.status(400).json({
        message: 'this fields are required to post a job'
      });
    }

    const addJob = await Job.create({
      ...req.body,
      jobPostedBy: user._id
    });

    user.postedJobs.push(addJob._id);
    await user.save();

    return res.status(201).json({
      message: 'New job posted'
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
} // 8/10

export const AllJobs = async (req, res) => {
  try {
    const allJobs = await Job.find();

    res.json({
      total_jobs: allJobs.length,
      jobs: allJobs
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: true,
      message: 'Internal server error'
    });
  }
} // 7.5/10

export const UpdateJob = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    const {
      jobTitle,
      jobLocation,
      jobSalaryRange,
      jobSkills,
      jobCategory,
      jobShift,
      jobKeyRes,
      jobReqQual,
      jobFullAddress,
      jobIntType,
      jobType
    } = req.body;

    const job = await Job.findOne({ _id: id });

    if (!job) {
      return res.status(400).json({
        message: 'Job not found'
      });
    }

    const isEmployerSame = job.jobPostedBy.toString() === user._id.toString();

    if (!isEmployerSame) {
      return res.status(403).json({
        message: 'Unauthorized access denied'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        $set: {
          jobTitle,
          jobLocation,
          jobSalaryRange,
          jobCategory,
          jobShift,
          jobFullAddress,
          jobIntType,
          jobType,
          jobSkills,
          jobKeyRes,
          jobReqQual
        },
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job details updated 🎉'
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
} // 8/10

export const RemoveJob = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    const job = await Job.findOne({ _id: id });

    if (!job) {
      return res.status(400).json({
        message: 'Job not found'
      });
    }

    const isEmployerSame = job.jobPostedBy.toString() === user._id.toString();

    if (!isEmployerSame) {
      return res.status(403).json({
        message: 'Unauthorized access denied'
      });
    }

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Job post deleted'
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
} // 7.5/10