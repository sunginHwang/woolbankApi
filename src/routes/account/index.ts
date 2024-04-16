import Router from '@koa/router';
import {
  completeAccountExpiration,
  getAccountByIdAndUserId,
  getAccountsByUserId,
  getLastUpdatedAccountDate,
  removeAccount,
  saveAccount
} from '../../service/accountService';
import { SaveAccountReqType } from '../../models/routes/SaveAccountReqType';
import { resError, resOK } from '../../utils/common';
import { saveDeposit } from '../../service/depositService';
import CommonError from '../../error/CommonError';
import isAuthenticated from "../../middleware/isAuthenticated";

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {
  const { limit } = ctx.query;
  const accounts = await getAccountsByUserId(ctx.userId, Number(limit));
  return resOK(ctx, accounts ? accounts : []);
});

router.get('/last-update-date', isAuthenticated, async (ctx) => {
  const lastUpdateDate = await getLastUpdatedAccountDate(ctx.userId);
  return resOK(ctx, lastUpdateDate);
});

router.get('/:accountId', isAuthenticated, async (ctx) => {
  const { accountId } = ctx.params;

  if (!Number.isInteger(Number(accountId))) {
    return resError({ ctx, errorCode: 400, message: `${accountId} is not allow request param` });
  }

  const account = await getAccountByIdAndUserId(Number(accountId), ctx.userId);

  if (!account) {
    throw new CommonError(`accountId:${accountId} is not found`, 404);
  }

  return resOK(ctx, account);
});

router.put('/:accountId/expiration', isAuthenticated, async (ctx) => {
  const { accountId } = ctx.params;

  if (!Number.isInteger(Number(accountId))) {
    return resError({ ctx, errorCode: 400, message: `${accountId} is not allow request param` });
  }

  const completedAccount = await completeAccountExpiration(Number(accountId), ctx.userId);

  return resOK(ctx, completedAccount.id);
});

router.post('/', isAuthenticated, async (ctx) => {
  const reqType: SaveAccountReqType = ctx.request.body as SaveAccountReqType;

  const accountValidation = !reqType.title || !reqType.taxType
      !reqType.startDate|| !reqType.endDate|| !reqType.regularTransferDate || !reqType.rate || !reqType.amount;

  if (accountValidation) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const savedAccount = await saveAccount(reqType, ctx.userId);

  // 정기예금일 경우 예금 채워넣기
  if (reqType.savingTypeId === 3) {
    await saveDeposit({
      userId: ctx.userId,
      depositDate: reqType.startDate,
      amount: savedAccount.amount,
      accountId: savedAccount.id
    });
  }

  resOK(ctx, {
    accountId: savedAccount.id
  });
});

router.delete('/:accountId', isAuthenticated, async (ctx) => {
  const { accountId } = ctx.params;

  if (!Number.isInteger(Number(accountId))) {
    return resError({ ctx, errorCode: 400, message: `accountId: ${accountId} is not allow request param` });
  }

  const result = await removeAccount(Number(accountId), ctx.userId);
  resOK(ctx, result);
});

router.get('/:accountId/last-update-date', isAuthenticated,async (ctx) => {
  const { accountId } = ctx.params;

  if (!accountId || !Number.isInteger(Number(accountId))) {
    return resError({ ctx, errorCode: 400, message: ` accountId: ${accountId} is not allow request param` });
  }

  const account = await getAccountByIdAndUserId(Number(accountId), ctx.userId);

  if (!account) {
    throw new CommonError(`accountId:${accountId} is not found`, 400);
  }

  resOK(ctx, account.updatedAt);
});

router.post('/:accountId/deposit', isAuthenticated, async (ctx) => {
  const { userId, params, request } = ctx;
  const { depositDate, amount } = request.body as any;
  const { accountId } = params;

  if (!amount || !Number.isInteger(Number(amount))) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }
  const savedDeposit = await saveDeposit({
    userId,
    depositDate: depositDate ? depositDate : new Date(),
    amount: Number(amount),
    accountId: Number(accountId)
  });

  if (savedDeposit) {
    resOK(ctx, savedDeposit);
  } else {
    resError({ ctx, errorCode: 500, message: '입금에 실패하였습니다.' });
  }
});

export default router;
