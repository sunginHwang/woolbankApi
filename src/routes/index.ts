import Router from '@koa/router';
import accounts from './account/index';

const routes = new Router();

routes.use('/accounts', accounts.routes());

routes.get('/', ctx => {
    ctx.body = 'hello world!';
});

export default routes;