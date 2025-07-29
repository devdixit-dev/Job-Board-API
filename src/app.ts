import express from 'express';
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
  return res.json({
    title: 'Your Next Chapter Starts Here',
    desc: 'We are more than just a job board; we are a career connection platform. We bridge the gap between passionate professionals looking to make their mark and innovative companies searching for that perfect spark. Forget the endless scrolling and resume black holes. We believe finding the right fit is about connecting people, not just matching keywords.'
  });
});

app.post('/pic', upload.single('avatar'), async (req, res, next) => {
  const result = await uploadOnCloud(`${req.file?.path}`);
  return res.json({
    message: 'file uploaded'
  });
});

app.use('/api/v1/auth', AuthRouter);

// app.use((req, res, next) => {
//   res.status(400).json({ message: '404 not found' });
//   next();
// });

// app.use((err: any, req: any, res: any, next: any) => {
//   res.status(500).json({ message: 'Something went wrong' });
//   next();
// });

export default app;