import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import redis from '../services/redis.service.js';
import transporter from '../services/mailer.service.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { decodeJwt, encodeJwt } from '../utils/jsonwebtoken.util.js';

export const CheckRoute = async (req, res) => {
  res.send('Auth api is working...');
}

export const UserRegister = async (req, res) => {
  const { fullName, userEmail, userContactNumber, userRole, password } = req.body;

  if (!fullName || !userEmail || !userContactNumber || !password) {
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

  const generatedOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  const otp = generatedOTP(); // genOTP

  const sessionId = uuidv4(); // genSessionID

  const newUser = {
    sessionId,
    fullName,
    userEmail,
    userContactNumber,
    userRole,
    password,
    verification_otp: otp
  }

  await redis.set(`sessionId`, JSON.stringify(newUser), 'EX', 1800)
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

  const decodedToken = await encodeJwt(newUser.sessionId);

  return res
    .cookie('sessionId', decodedToken, {
      maxAge: 30 * 60 * 1000
    }).status(200)
    .json({
      success: true,
      message: `Welcome ${newUser.fullName}. We just sent you 6 digit OTP for account verification.`,
    });
}

export const UserOTPVerification = async (req, res) => {
  const sessionFromCookie = req.cookies.sessionId;
  const decodedToken = await decodeJwt(sessionFromCookie)
  console.log(decodedToken)

  const user = await redis.get(sessionFromCookie);

  if (!sessionFromCookie || !user) {
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

  const isUserAuth = parsedData.sessionId === decodedToken;
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

    await redis.expire(sessionFromCookie, 1);

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

export const UserLogin = async (req, res) => {

}