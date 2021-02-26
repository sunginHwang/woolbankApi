import Router from '@koa/router';

import account from './account/index';
import bucketList from './bucketList/index';
import todo from './todo/index';
import auth from './auth/index';
import user from './user/index';
import main from './main/index';
import regularExpenditure from './regularExpenditure/index';

import config from '../config/baseConfig';

const routes = new Router();

routes.use('/main', main.routes());
routes.use('/accounts', account.routes());
routes.use('/bucket-list', bucketList.routes());
routes.use('/regular-expenditures', regularExpenditure.routes());
routes.use('/todo', todo.routes());
routes.use('/auth', auth.routes());
routes.use('/user', user.routes());

routes.get('/', (ctx) => {
  ctx.body = config;
});

export default routes;
