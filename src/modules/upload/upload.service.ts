import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUD_KEY'),
      api_secret: this.configService.get<string>('CLOUD_SECRET'),
    });
  }

  async uploadImage(
    buffer: Buffer,
    fileInfo: { name: string; mimetype: string },
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'skinnavi',
          public_id: fileInfo.name.split('.')[0] + '_' + Date.now(),
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(
              new BadRequestException(
                `Cloudinary upload failed: ${error.message}`,
              ),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}
