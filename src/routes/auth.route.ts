import express from 'express';

const AuthRouter = express.Router();

AuthRouter.get('/check', (req, res) => {
  res.send('/auth API')
});

export default AuthRouter;