import Router from '@koa/router';
import fs from 'fs';
import sharp from 'sharp';
import crypto from 'crypto';
import koaBody from 'koa-body';

import account from './account/index';
import bucketList from './bucketList/index';
import todo from './todo/index';
import auth from './auth/index';
import user from './user/index';

import { resError, resOK } from '../utils/common';
import { getRootPath } from '../utils/file';

const routes = new Router();

routes.use('/accounts', account.routes());
routes.use('/bucket-list', bucketList.routes());
routes.use('/todo', todo.routes());
routes.use('/auth', auth.routes());
routes.use('/user', user.routes());

routes.post(
  '/upload',
  koaBody({
    multipart: true
  }),
  async (ctx, next) => {
    const file = ctx.request.files ? ctx.request.files.image : null;

    if (!file) {
      return resError({ ctx, errorCode: 400, message: 'not exist file' });
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
    } catch (e) {
      // 실패시 파일 삭제 (롤백처리)
      fs.unlinkSync(originUploadPath);
      fs.unlinkSync(thumbnailUploadPath);
      resError({ ctx, errorCode: 500, message: e });
    }

    return resOK(ctx, {
      imageUrl: originPath,
      thumbImageUrl: thumbImagePath
    });
  }
);

routes.get('/', (ctx) => {
  ctx.body = 'hello world!';
});

export default routes;
