import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const file_path = `${process.env.TEMP_URL}`
    cb(null, file_path);
  },
  filename: (req, file, cb) => {
    const fileName = 'uploadedfile';
    cb(null, fileName + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;