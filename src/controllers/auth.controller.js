import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import redis from '../services/redis.service.js';
import transporter from '../services/mailer.service.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { decodeJwt, encodeJwt } from '../utils/jsonwebtoken.util.js';

export const CheckRoute = async (req, res) => {
  res.status(200).send('Auth api is working...');
} // 10/10

export const UserRegister = async (req, res) => {
  const { fullName, userEmail, userContactNumber, userRole, password } = req.body;

  if (!fullName || !userEmail || !userContactNumber || !password) {
    return res.status(400).json({
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
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: true
    }).status(200)
    .json({
      success: true,
      message: `Welcome ${newUser.fullName}. We just sent you 6 digit OTP for account verification.`,
    });
} // 9/10

export const UserOTPVerification = async (req, res) => {
  const { otp } = req.body;

  const id = req.cookies.sessionId;
  const decodedToken = await decodeJwt(id)

  const user = await redis.get(`sessionId`);

  if (!id || !user) {
    return res.status(400).json({
      message: 'You are not authenticated user or register again'
    });
  }

  if (!otp) {
    return res.status(400).json({
      message: 'Verification OTP is required'
    });
  }

  const parsedData = JSON.parse(`${user}`);

  const isUserAuth = parsedData.sessionId === decodedToken.id;

  const checkOTP = otp === parsedData.verification_otp; // vulnerable

  if (!checkOTP) {
    return res.status(400).json({
      message: 'Your verification OTP is incorrect'
    });
  }

  const hashPassword = await bcrypt.hash(parsedData.password, 10);

  if (isUserAuth) {
    const newUser = await User.create({
      fullName: parsedData.fullName,
      userEmail: parsedData.userEmail,
      userContactNumber: parsedData.userContactNumber,
      userRole: parsedData.userRole,
      password: hashPassword,
      isUserVerified: true
    });

    await redis.del(`sessionId`);

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
} // 8.5/10

export const UserLogin = async (req, res) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    return res.status(400).json({
      message: 'All fields are required for login'
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const isUserRegistered = await User.findOne({ userEmail: userEmail });

  if (!isUserRegistered) {
    return res.status(400).json({
      message: 'Account not found. Do registration first',
      redirectedTo: '/register'
    });
  }

  if (!isUserRegistered.isUserVerified) {
    return res.status(400).json({
      message: 'You need to verify your account first before login. Check your email for verification code',
      timeLimit: '30m'
    });
  }

  const decodePassword = await bcrypt.compare(password, isUserRegistered.password);

  if (!decodePassword) {
    return res.status(400).json({
      message: 'Invalid email or password',
      suggestion: 'reset-password'
    });
  }

  const encodeToken = await encodeJwt(isUserRegistered._id);

  res.clearCookie('sessionId');

  isUserRegistered.isUserLoggedIn = true
  await isUserRegistered.save();

  return res
    .cookie('token', encodeToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: true
    })
    .status(200)
    .json({
      message: `Welcome back, ${isUserRegistered.fullName} 🎈`,
    });
} // 9/10

export const UserLogout = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      message: 'User not found'
    });
  }

  user.isUserLoggedIn = false
  await user.save();

  res.clearCookie('token', {
    httpOnly: true,
    secure: true
  });

  return res.status(200).json({
    message: 'User logged out successfully'
  });
} // 9/10

export const UserVerifyEmail = async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({
      message: 'Email field is required for verification'
    });
  }

  const user = await User.findOne({ userEmail });

  if (!user) {
    return res.status(400).json({
      message: 'User not found'
    });
  }

  const generatedOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  const otp = generatedOTP();

  await transporter.sendMail({
    from: 'msi.devdixit@gmail.com',
    to: userEmail,
    subject: 'OTP for Resetting Password',
    text: `OTP Verification`,
    html: `Your verification otp is <b>${otp}</b>`
  })

  await redis.set(`${user._id}`, JSON.stringify(otp), 'EX', 900);

  const encodeToken = await encodeJwt(user._id);

  res.cookie('token', encodeToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000
  });

  return res.status(200).json({
    message: `We just sent a 6-digit OTP to your email for password reset verification.`
  });
} // 8.5/10

export const UserVerifyOtp = async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  const userDoc = await User.findById(user._id);
  if (!userDoc) return res.status(404).json({ message: 'User not found' });


  const parsedData = await redis.get(`${user._id}`);

  const matchOtp = JSON.parse(parsedData) === otp

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }


  if (!matchOtp) {
    return res.status(400).json({
      message: 'Incorrect OTP'
    });
  }

  await redis.del(`${user._id}`);

  return res.status(200).json({
    message: 'OTP Verified. Now you can change the password',
    redirect: '/reset-password'
  });
} // 9/10

export const UserResetPassword = async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  const user = req.user;

  if (!newPassword || !confirmNewPassword) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      message: 'Your password must be matched'
    })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long'
    });
  }


  const decodeOldPassword = await bcrypt.compare(newPassword, user.password);

  if (decodeOldPassword) {
    return res.status(400).json({
      message: 'New password will be different from the old password'
    });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;
  await user.save();

  res.clearCookie('token', {
    httpOnly: true,
    secure: true
  });

  return res.status(200).json({
    message: 'Your password has been reset successfully.',
    redirectedTo: '/login'
  });
} // 9/10