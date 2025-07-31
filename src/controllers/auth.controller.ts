import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import redis from '../services/redis.service';
import transporter from '../services/mailer.service';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

export const CheckRoute = async (req: any, res: any) => {
  res.send('Auth api is working...');
}

export const UserRegister = async (req: any, res: any) => {
  const { fullName, companyName, userEmail, userContactNumber, userRole, password } = req.body;

  if (!fullName || !companyName || !userEmail || !userContactNumber || !password) {
    return res.json({
      message: 'All fields are required for registration'
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const isUserAlreadyExisted = await User.findOne({ userEmail });

  if (isUserAlreadyExisted) {
    return res.status(400).json({
      message: 'User already existed. Do login'
    });
  }

  const generatedOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  const otp = generatedOTP(); // genOTP

  const sessionId = uuidv4(); // genSessionID

  const newUser = {
    sessionId,
    fullName,
    companyName,
    userEmail,
    userContactNumber,
    userRole,
    password,
    verification_otp: otp
  }

  await redis.set(`sessionId`, JSON.stringify(newUser), 'EX', 3600)
    .then(() => { console.log(`User data stored`) })
    .catch((e) => { console.log(`Error while storing user in redis - ${e}`) });
  // expire after 1 hour
  // store data temp

  await transporter.sendMail({
    from: 'msi.devdixit@gmail.com',
    to: userEmail,
    subject: 'Hello from Job Board API',
    text: `Welcome to the Job Board API. You just created an account with ${userEmail}.`,
    html: `Your verification otp is <b>${otp}</b>`
  });

  return res
    .cookie('sessionId', sessionId, {
      maxAge: 60 * 60 * 1000
    }).status(200)
    .json({
      success: true,
      message: 'Welcome mail send',
      otp
    });
}

export const UserOTPVerification = async (req: any, res: any) => {
  const sessionFromCookie = req.cookies.sessionId;
  const user = await redis.get(`sessionId`);

  if (!sessionFromCookie && !user) {
    return res.status(400).json({
      message: 'You are not authenticated user or register again'
    });
  }

  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: 'Verification OTP is required'
    });
  }

  const parsedData = JSON.parse(`${user}`);

  const isUserAuth = parsedData.sessionId === sessionFromCookie
  console.log(isUserAuth)

  const checkOTP = otp === parsedData.verification_otp;

  if (!checkOTP) {
    return res.status(400).json({
      message: 'Your verification OTP is incorrect'
    });
  }

  const hashPassword = await bcrypt.hash(parsedData.password, 10);

  if (isUserAuth) {
    const newUser = await User.create({
      fullName: parsedData.fullName,
      companyName: parsedData.companyName,
      companyEmail: parsedData.userEmail,
      companyContactNumber: parsedData.userContactNumber,
      userRole: parsedData.userRole,
      password: hashPassword,
      isUserVerified: true
    });

    await redis.expire('sessionId', 1);

    return res.status(201).json({
      message: 'User registered',
      user: newUser
    });
  }
  else {
    return res.status(400).json({
      message: 'You need to do register again'
    });
  }
}