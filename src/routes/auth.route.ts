import express from 'express';
import { CheckRoute } from '../controllers/auth.controller';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute)

export default AuthRouter;