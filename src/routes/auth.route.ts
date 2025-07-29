import express from 'express';
import { CheckRoute, EmployerRegister } from '../controllers/auth.controller';
import { EmployerRegisterValidator } from '../validators/employerRegister.validator';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute);

AuthRouter.post('/register/employer', EmployerRegisterValidator, EmployerRegister);

export default AuthRouter;