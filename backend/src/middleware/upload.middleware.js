const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

const fileFilter = (allowedMimes) => (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type. Allowed: ${allowedMimes.join(', ')}`));
  }
};

const PDF_MIME = ['application/pdf'];
const IMAGE_MIME = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const DOC_MIME = [...PDF_MIME, ...IMAGE_MIME];

const uploadResume = multer({
  storage,
  fileFilter: fileFilter(PDF_MIME),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('resume');

const uploadCertificate = multer({
  storage,
  fileFilter: fileFilter(DOC_MIME),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('certificate');

const uploadImage = multer({
  storage,
  fileFilter: fileFilter(IMAGE_MIME),
  limits: { fileSize: 3 * 1024 * 1024 },
}).single('image');

/** Wraps a multer middleware so its errors flow into the global error handler */
const safeUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(400, `Upload error: ${err.message}`));
      }
      return next(err);
    }
    next();
  });
};

module.exports = {
  uploadResume: safeUpload(uploadResume),
  uploadCertificate: safeUpload(uploadCertificate),
  uploadImage: safeUpload(uploadImage),
};
