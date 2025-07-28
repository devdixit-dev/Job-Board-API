import express from 'express';
import multer from 'multer';
import upload from './middlewares/multer.middleware';
import AuthRouter from './routes/auth.route';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.end(`Home or / Page`);
});

app.post('/pic', upload.single('avatar'), (req, res, next) => {
  console.log(`profile pic uploaded.`);
  next();
});

app.use('/auth', AuthRouter);

app.use((req, res, next) => {
  res.status(400).json({ message: '404 not found' });
});

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;