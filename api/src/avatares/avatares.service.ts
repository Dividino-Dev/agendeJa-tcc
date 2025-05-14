import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AvataresService {
  renameFile(originalName: string): string {
    const fileExt = extname(originalName);
    const newFileName = `${uuidv4()}${fileExt}`;
    return newFileName;
  }
}