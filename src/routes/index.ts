import Router from '@koa/router';

import account from './account/index';
import bucketList from './bucketList/index';
import todo from './todo/index';
import auth from './auth/index';
import user from './user/index';
import main from './main/index';
import accountBook from './accountBook/index';
import accountBookCategory from './accountBookCategory/index';

import regularExpenditure from './regularExpenditure/index';

import config from '../config/baseConfig';
import accountBookCategoryImage from './accountBookCategoryImage/index';

const routes = new Router();

routes.use('/main', main.routes());
routes.use('/accounts', account.routes());
routes.use('/account-books', accountBook.routes());
routes.use('/account-book-categories', accountBookCategory.routes());
routes.use('/account-book-category-images', accountBookCategoryImage.routes());
routes.use('/bucket-list', bucketList.routes());
routes.use('/regular-expenditures', regularExpenditure.routes());
routes.use('/todo', todo.routes());
routes.use('/auth', auth.routes());
routes.use('/user', user.routes());

routes.get('/', (ctx) => {
  ctx.body = config;
});

export default routes;
