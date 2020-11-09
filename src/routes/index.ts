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
import main from './main/index';
import config from '../config/baseConfig';

const routes = new Router();

routes.use('/main', main.routes());
routes.use('/accounts', account.routes());
routes.use('/bucket-list', bucketList.routes());
routes.use('/todo', todo.routes());
routes.use('/auth', auth.routes());
routes.use('/user', user.routes());

routes.get('/', (ctx) => {
  ctx.body = config;
});

export default routes;
