// src/modules/skin-analysis/skin-analysis.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  // Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkinAnalysisService } from './skin-analysis.service';
import multer from 'multer';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

@Controller('skin-analysis')
export class SkinAnalysisController {
  constructor(private readonly service: SkinAnalysisService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only support: JPEG, PNG, WebP'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAndAnalyze(
    @UploadedFile() file: Express.Multer.File,
    // @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Please provide an image file');
    }

    // TODO: lấy từ JWT khi auth xong
    // const userId = req.user.id;
    const userId = 'test-user-id-123';

    const result = await this.service.analyzeSkinFromImage(userId, file);

    return {
      success: true,
      message: 'Skin analysis completed successfully',
      data: result,
    };
  }
}
