import express from 'express';
import multer from 'multer';
import upload from './middlewares/multer.middleware';
import AuthRouter from './routes/auth.route';
import uploadOnCloud from './utils/cloudinary.util';

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.end(`Home or / Page`);
});

app.post('/pic', upload.single('avatar'), async (req, res, next) => {
  const result = await uploadOnCloud(`${req.file?.path}`);
  return res.json({
    message: 'file uploaded'
  });
});

app.use('/auth', AuthRouter);

app.use((req, res, next) => {
  res.status(400).json({ message: '404 not found' });
});

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ message: 'Something went wrong' });
  next();
});

export default app;