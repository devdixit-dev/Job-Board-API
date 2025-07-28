import express from 'express';
import { CheckRoute, EmployerRegister, EmployeeRegister } from '../controllers/auth.controller';
import { EmployerRegisterValidator } from '../validators/employerRegister.validator';

const AuthRouter = express.Router();

AuthRouter.get('/check', CheckRoute);

// EmployerRegisterValidator
AuthRouter.post('/register/employer', EmployerRegister);

AuthRouter.post('/register/employee', EmployeeRegister);

export default AuthRouter;