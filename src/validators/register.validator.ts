import { body } from 'express-validator';

export const RegisterValidator = [
  body('userEmail')
  .isEmail()
  .withMessage('Invalid email address'),

  body('userContactNumber')
  .isNumeric()
  .withMessage('Contact number must be numeric'),

  body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
]