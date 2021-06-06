import Router from '@koa/router';
import {
  getAccountBookCategoriesByUserId,
  removeAccountBookCategory,
  saveAccountBookCategory
} from '../../service/accountBookCategoryService';
import { resError, resOK } from '../../utils/common';
import isAuthenticated from '../../middleware/isAuthenticated';
import { AccountBookCategoryReqType } from '../../models/routes/AccountBookCategoryReqType';

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {
  const { limit } = ctx.query;

  const accountBookCategories = await getAccountBookCategoriesByUserId(ctx.userId, limit);
  return resOK(ctx, accountBookCategories ? accountBookCategories : []);
});

router.post('/', isAuthenticated, async (ctx) => {
  const reqType: AccountBookCategoryReqType = ctx.request.body;

  const isValidRequest = !reqType.name || !reqType.type;

  if (isValidRequest) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const accountBookCategory = await saveAccountBookCategory(reqType, ctx.userId);

  resOK(ctx, accountBookCategory);
});

router.delete('/:accountBookCategoryId', isAuthenticated, async (ctx) => {
  const { accountBookCategoryId } = ctx.params;

  if (!Number.isInteger(Number(accountBookCategoryId))) {
    return resError({
      ctx,
      errorCode: 400,
      message: `accountBookCategoryId: ${accountBookCategoryId} is not allow request param`
    });
  }

  const accountBookCategory = await removeAccountBookCategory(Number(accountBookCategoryId), ctx.userId);

  resOK(ctx, accountBookCategory);
});

export default router;
