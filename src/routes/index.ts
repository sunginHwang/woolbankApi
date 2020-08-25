import Router from '@koa/router';
import account from './account/index';
import bucketList from './bucketList/index';
import todo from './todo/index';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
const routes = new Router();
import {resError, resOK} from "../utils/common";
import koaBody from "koa-body";

// @ts-ignore
const rootPath = path.dirname(require.main.filename || process.mainModule.filename);

routes.use('/accounts', account.routes());
routes.use('/bucket-list', bucketList.routes());
routes.use('/todo', todo.routes());

routes.post('/upload',koaBody({
    multipart: true
}),async (ctx, next) => {
    const file = ctx.request.files ? ctx.request.files.image : null;

    if(!file) {
        return resError({ctx, errorCode: 400, message: 'not exist file'});
    }

    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(rootPath + '/uploads/' + file.name);
    await reader.pipe(stream);

    await sharp(rootPath + '/uploads/' + file.name)
        .resize(80)
        .toFile(rootPath + '/uploads/thum/' + file.name);

    console.log('uploading %s -> %s', file.name, stream.path);

    return resOK(ctx, 'success');
})

routes.get('/', ctx => {
    ctx.body = 'hello world!';
});

export default routes;
