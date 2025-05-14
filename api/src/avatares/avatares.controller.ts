import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import { writeFileSync } from 'fs';
import * as sharp from 'sharp';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('upload')
export class AvataresController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id;
    const filename = `${userId}.png`;
    const outputPath = join(process.cwd(), 'public', 'uploads', filename);

    await sharp(file.buffer)
      .png()
      .toFile(outputPath);

    return {
      message: 'Arquivo convertido e salvo como PNG com sucesso!',
      filename,
      url: `/static/uploads/${filename}`,
    };
  }
}
