import express from 'express';
import { AllJobs, checkRoute, PostJob, UpdateJob } from '../controllers/job.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { CheckEmployer } from '../middlewares/checkRole.middleware.js'

const JobRouter = express.Router();

JobRouter.get('/', checkRoute);

JobRouter.post('/post-job', AuthMiddleware, CheckEmployer, PostJob);

JobRouter.put('/update/:id', AuthMiddleware, CheckEmployer, UpdateJob);

JobRouter.get('/all', AuthMiddleware, AllJobs);

export default JobRouter;

// localhost:7000/api/v2/job ✅
// localhost:7000/api/v2/job/post-job ✅
// localhost:7000/api/v2/job/update-job/:id ✅
// localhost:7000/api/v2/job/all ✅
// localhost:7000/api/v2/job/delete-job/:id