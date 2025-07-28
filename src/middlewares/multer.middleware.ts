import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const file_path = 'C:/Users/Dev Dixit/Desktop/Advance Prep/Job Board API/src/temp'
    cb(null, file_path);
  },
  filename: (req, file, cb) => {
    const fileName = 'uploadedfile';
    cb(null, fileName + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;