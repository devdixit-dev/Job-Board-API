import express from 'express';
import { CheckRoute, UserRegister, UserOTPVerification } from '../controllers/auth.controller';
import { RegisterValidator } from '../validators/register.validator';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute);

AuthRouter.post('/register', RegisterValidator, UserRegister);

AuthRouter.post('/verification', UserOTPVerification);

export default AuthRouter;