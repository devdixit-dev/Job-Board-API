import express from 'express';
import { CheckRoute, EmployerRegister, UserOTPVerification } from '../controllers/auth.controller';
import { EmployerRegisterValidator } from '../validators/employerRegister.validator';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute);

AuthRouter.post('/register/employer', EmployerRegisterValidator, EmployerRegister);

AuthRouter.post('/verification', UserOTPVerification);

export default AuthRouter;