import Job from '../models/job.model.js'

export const checkRoute = (req, res) => {
  res.send('route is working');
}

export const PostJob = async (req, res) => {
  try{
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

    if(!jobTitle || !jobLocation || !jobSkills || !jobKeyRes || !jobReqQual) {
      return res.status(400).json({
        message: 'this fields are required to post a job'
      });
    }

    const addJob = await Job.create({
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
      jobType,
      jobPostedBy: user._id
    });

    await user.postedJobs.push(addJob._id);
    await user.save();

    return res.status(201).json({
      message: 'New job posted',
      job: addJob
    });
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export const AllJobs = async (req, res) => {
  try{
    const allJobs = await Job.find();

    res.json({
      total_jobs: allJobs.length,
      jobs: allJobs
    });
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}