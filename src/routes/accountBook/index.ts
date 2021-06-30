import Router from '@koa/router';
import {
  getAccountBooksByUserIdAndDateTime,
  convertClientAccountBook,
  saveAccountBook,
  getAccountBookMonthlyStatistics
} from '../../service/accountBookService';
import { resError, resOK } from '../../utils/common';
import isAuthenticated from '../../middleware/isAuthenticated';
import { SaveAccountBookReqType } from '../../models/routes/SaveAccountBookReqType';

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {
  const { limit, dateTime } = ctx.query;
  const accountBooks = await getAccountBooksByUserIdAndDateTime({
    userId: ctx.userId,
    dateTime: new Date(dateTime),
    limit
  });

  return resOK(ctx, accountBooks.map(convertClientAccountBook) || []);
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

router.get('/statistics', isAuthenticated, async (ctx) => {
  const { startDate, endDate, type } = ctx.query;

  const isValidRequest = !startDate || !endDate || !type || (type !== 'income' && type !== 'expenditure');

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const accountBookStatistic = await getAccountBookMonthlyStatistics({
    userId: ctx.userId,
    type,
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  });

  return resOK(ctx, accountBookStatistic);
});
export default router;
