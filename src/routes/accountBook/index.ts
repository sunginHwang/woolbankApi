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
import isRealUserAuthenticated from '../../middleware/isRealUserAuthenticated';

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {
  const { limit, dateTime } = ctx.query;
  const accountBooks = await getAccountBooksByUserIdAndDateTime({
    userId: ctx.userId,
    dateTime: new Date(dateTime as any),
    limit: Number(limit),
  });

  return resOK(ctx, accountBooks.map((item) => convertClientAccountBook(item, false)) || []);
});

router.get('/statistics', isAuthenticated, async (ctx) => {
  const { startDate, endDate, type } = ctx.query as any;

  const isValidRequest = !startDate || !endDate || !type || (type !== 'income' && type !== 'expenditure');

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const accountBookStatistic = await getAccountBookMonthlyStatistics({
    userId: ctx.userId,
    type,
    startDate: new Date(startDate as string),
    endDate: new Date(endDate as string)
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

router.post('/', isAuthenticated, isRealUserAuthenticated, async (ctx) => {
  const reqType: SaveAccountBookReqType = ctx.request.body as SaveAccountBookReqType;

  const isValidRequest =
    !reqType.amount || !reqType.title || !reqType.registerDateTime || !reqType.categoryId || !reqType.type;

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const accountBook = await saveAccountBook(reqType, ctx.userId);

  resOK(ctx, accountBook);
});

router.put('/:accountBookId', isAuthenticated, isRealUserAuthenticated, async (ctx) => {
  const reqType: SaveAccountBookReqType = ctx.request.body as SaveAccountBookReqType;
  const { accountBookId } = ctx.params;
  const isValidRequest =
    !reqType.amount || !reqType.title || !reqType.registerDateTime || !reqType.categoryId || !reqType.type;

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const updatedAccountBook = await updateAccountBook(reqType, Number(accountBookId), ctx.userId);

  resOK(ctx, updatedAccountBook);
});

router.delete('/:accountBookId', isAuthenticated, isRealUserAuthenticated, async (ctx) => {
  const { accountBookId } = ctx.params;

  if (!Number.isInteger(Number(accountBookId))) {
    return resError({ ctx, errorCode: 400, message: `accountBookId: ${accountBookId} is not allow request param` });
  }

  const removedAccountBookId = await removeAccountBook(Number(accountBookId), ctx.userId);

  resOK(ctx, removedAccountBookId);
});

export default router;
