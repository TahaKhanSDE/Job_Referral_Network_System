import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';

// Cloudinary v2 reads CLOUDINARY_URL from process.env automatically.

// Use in-memory storage — we stream the buffer to Cloudinary ourselves.
const memStorage = multer.memoryStorage();

const multerInstance = multer({
  storage: memStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

/**
 * Middleware factory that mirrors the multer-storage-cloudinary interface:
 * after multer populates req.file.buffer, we upload to Cloudinary and
 * overwrite req.file.path with the secure URL so the controller stays unchanged.
 */
const streamToCloudinary = (
  req: any,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.file) return next();

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'refnet_resumes',
      resource_type: 'raw',
      format: 'pdf',
    },
    (error, result) => {
      if (error) return next(error);
      // Expose the secure URL on req.file.path — matches what the controller reads.
      req.file.path = result?.secure_url ?? '';
      next();
    }
  );

  stream.end(req.file.buffer);
};

/**
 * Compose the two middlewares into a single handler that routes can use as:
 *   upload.single('resume')
 */
const upload = {
  single: (fieldName: string) =>
    [
      multerInstance.single(fieldName),
      streamToCloudinary,
    ] as unknown as (req: Request, res: Response, next: NextFunction) => void,
};

export default upload;
