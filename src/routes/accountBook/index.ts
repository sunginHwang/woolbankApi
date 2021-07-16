import Router from '@koa/router';
import {
  getAccountBooksByUserIdAndDateTime,
  convertClientAccountBook,
  saveAccountBook,
  getAccountBook,
  getAccountBookMonthlyStatistics, updateAccountBook, removeAccountBook
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

  return resOK(ctx, accountBooks.map((item) => convertClientAccountBook(item, false)) || []);
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

router.get('/:accountBookId', isAuthenticated, async (ctx) => {
  const { accountBookId } = ctx.params;

  if (!Number.isInteger(Number(accountBookId))) {
    return resError({ ctx, errorCode: 400, message: `${accountBookId} is not allow request param` });
  }

  const accountBook = await getAccountBook({
    userId: ctx.userId,
    id: Number(accountBookId)
  });

  return resOK(ctx, convertClientAccountBook(accountBook, true));
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

router.put('/:accountBookId', isAuthenticated, async (ctx) => {
  const reqType: SaveAccountBookReqType = ctx.request.body;
  const { accountBookId } = ctx.params;
  const isValidRequest =
    !reqType.amount || !reqType.title || !reqType.registerDateTime || !reqType.categoryId || !reqType.type;

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const updatedAccountBook = await updateAccountBook(reqType, Number(accountBookId), ctx.userId);

  resOK(ctx, updatedAccountBook);
});

router.delete('/:accountBookId', isAuthenticated, async (ctx) => {
  const { accountBookId } = ctx.params;

  if (!Number.isInteger(Number(accountBookId))) {
    return resError({ ctx, errorCode: 400, message: `accountBookId: ${accountBookId} is not allow request param` });
  }

  const removedAccountBookId = await removeAccountBook(accountBookId, ctx.userId);

  resOK(ctx, removedAccountBookId);
});

export default router;
