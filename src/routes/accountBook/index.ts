import Router from '@koa/router';
import { getAccountBooksByUserId, saveAccountBook } from '../../service/accountBookService';
import { resError, resOK } from '../../utils/common';
import isAuthenticated from '../../middleware/isAuthenticated';
import { SaveAccountBookReqType } from '../../models/routes/SaveAccountBookReqType';
import { AccountBookCategoryType } from '../../models/AccountBookCategoryType';

const router = new Router();

interface IListRes {
  id: number;
  title: string;
  categoryName: string;
  type: AccountBookCategoryType;
  isRegularExpenditure: boolean;
  amount: number;
  registerDateTime: Date;
}

router.get('/', isAuthenticated, async (ctx) => {
  const { limit } = ctx.query;

  const accountBooks = await getAccountBooksByUserId(ctx.userId, limit);

  const response: IListRes[] = accountBooks.map((accountBook) => {
    const { id, title, type, isRegularExpenditure, amount, registerDateTime, accountBookCategory } = accountBook;
    return {
      id,
      title,
      type,
      isRegularExpenditure,
      amount,
      registerDateTime,
      categoryName: accountBookCategory.name
    };
  });
  return resOK(ctx, response || []);
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
