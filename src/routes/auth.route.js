import express from 'express';
import { CheckRoute, UserRegister, UserOTPVerification, UserLogin, UserLogout } from '../controllers/auth.controller.js';
import { RegisterValidator } from '../validators/register.validator.js';
import { LoginValidator } from '../validators/login.validator.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute);

AuthRouter.post('/register', RegisterValidator, UserRegister);

AuthRouter.post('/verification', UserOTPVerification);

AuthRouter.post('/login', LoginValidator, UserLogin);

AuthRouter.post('/logout', AuthMiddleware, UserLogout);

export default AuthRouter;