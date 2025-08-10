import express from 'express';
import { checkRoute } from '../controllers/job.controller.js';
import { CheckEmployee } from '../middlewares/checkRole.middleware.js';

const JobRouter = express.Router();

JobRouter.get('/', checkRoute);

JobRouter.get('/all', CheckEmployee, checkRoute);

export default JobRouter;

// localhost:7000/api/v2/job
// localhost:7000/api/v2/job/post-job
// localhost:7000/api/v2/job/update-job/:id
// localhost:7000/api/v2/job/all
// localhost:7000/api/v2/job/delete-job/:id