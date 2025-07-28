import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/temp/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = 'uploadedfile';
    cb(null, file.originalname + '_' + fileName);
  }
});

const upload = multer({ storage: storage });

export default upload;