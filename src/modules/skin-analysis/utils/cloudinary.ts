// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export async function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'skin-analysis',
          resource_type: 'auto',
          timeout: 60000,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary upload failed: no result'));
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (error) {
      reject(
        new Error(
          `Upload error: ${error instanceof Error ? error.message : 'Unknown'}`,
        ),
      );
    }
  });
}
