import { body } from 'express-validator';

export const LoginValidator = [
  body('userEmail')
  .isEmail()
  .withMessage('Invalid email address'),

  body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long. Please recheck your password')
]