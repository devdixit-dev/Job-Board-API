import { body } from 'express-validator';

export const EmployerRegisterValidator = [
  body('companyEmail')
    .isEmail()
    .withMessage('Invalid email address'),

  body('companyContactNumber')
    .isNumeric()
    .withMessage('Contact number must be numeric'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];
