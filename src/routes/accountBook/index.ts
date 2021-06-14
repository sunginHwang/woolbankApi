import Router from '@koa/router';
import { getAccountBooksByUserIdAndDateTime, saveAccountBook } from '../../service/accountBookService';
import { resError, resOK } from '../../utils/common';
import isAuthenticated from '../../middleware/isAuthenticated';
import { SaveAccountBookReqType } from '../../models/routes/SaveAccountBookReqType';

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {
  const { limit, dateTime } = ctx.query;
  const accountBooks = await getAccountBooksByUserIdAndDateTime({ userId: ctx.userId, dateTime: new Date(dateTime), limit});

  return resOK(ctx, accountBooks || []);
});

router.post('/', isAuthenticated, async (ctx) => {
  const reqType: SaveAccountBookReqType = ctx.request.body;

  const isValidRequest =
    !reqType.amount || !reqType.title || !reqType.registerDateTime || !reqType.categoryId || !reqType.type;

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const accountBook = await saveAccountBook(reqType, ctx.userId);

  resOK(ctx, accountBook);
});

export default router;
