import Router from '@koa/router';
import account from './account/index';
import bucketList from './bucketList/index';
import todo from './todo/index';

const routes = new Router();

routes.use('/accounts', account.routes());
routes.use('/bucket-list', bucketList.routes());
routes.use('/todo', todo.routes());

routes.get('/', ctx => {
    ctx.body = 'hello world!';
});

export default routes;
