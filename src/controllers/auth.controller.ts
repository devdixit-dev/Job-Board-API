import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import redis from '../services/redis.service';
import transporter from '../services/mailer.service';

export const CheckRoute = async (req: any, res: any) => {
  res.send('Auth api is working...');
}

export const EmployerRegister = async (req: any, res: any) => {
  const { fullName, companyName, companyEmail, companyContactNumber, password } = req.body;

  if(!fullName || !companyName || !companyEmail || !companyContactNumber || !password) {
    return res.json({
      message: 'All fields are required for registration'
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // const sessionId = uuidv4();
  // await redis.set('session-id', sessionId, 'EX', 3600); // expire after 1 hour

  const generatedOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const otp = generatedOTP();

  console.log(req.body);
  console.log(otp);


  // await transporter.sendMail({
  //   from: 'Job Board API',
  //   to: req.body.companyEmail,
  //   subject: 'Hello from Job Board API',
  //   text: `Welcome to the Job Board API. You just created an account with ${req.body.companyEmail}.`,
  //   html: `Your verification otp is <b>${generatedOTP}</b>`
  // })


}

export const EmployeeRegister = async (req: any, res: any) => {
  
}