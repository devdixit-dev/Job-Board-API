import express from 'express';
import { CheckRoute, UserRegister, UserOTPVerification, UserLogin } from '../controllers/auth.controller.js';
import { RegisterValidator } from '../validators/register.validator.js';
import { LoginValidator } from '../validators/login.validator.js';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute);

AuthRouter.post('/register', RegisterValidator, UserRegister);

AuthRouter.post('/verification', UserOTPVerification);

AuthRouter.post('/login', LoginValidator, UserLogin);

export default AuthRouter;