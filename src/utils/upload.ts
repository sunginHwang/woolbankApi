import { getRootPath } from './file';
import crypto from 'crypto';
import fs from 'fs';
import sharp from 'sharp';
import config from '../config/baseConfig';
import { File } from 'formidable';
import CommonError from '../error/CommonError';

export const imageUpload = async (file: File) => {
  if (!file) {
    return null;
  }

  const rootPath = getRootPath();
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const fileName = `${uniqueId}_${file.name}`;

  const originPath = `/uploads/${fileName}`;
  const thumbImagePath = `/uploads/thumb/${fileName}`;
  const originUploadPath = `${rootPath}${originPath}`;
  const thumbnailUploadPath = `${rootPath}${thumbImagePath}`;

  try {
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(originUploadPath);
    await reader.pipe(stream);

    await sharp(file.path).resize(80, 80, { fit: 'fill' }).toFile(thumbnailUploadPath);

    return {
      imageUrl: `${config.uploadUrl}${originPath}`,
      thumbImageUrl: `${config.uploadUrl}${thumbImagePath}`
    };
  } catch (e) {
    // 실패시 파일 삭제 (롤백처리)
    fs.unlinkSync(originUploadPath);
    fs.unlinkSync(thumbnailUploadPath);
    throw new CommonError('파일 업로드 실패', 400);
  }

};
