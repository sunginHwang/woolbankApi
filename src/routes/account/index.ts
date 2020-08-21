import Router from '@koa/router';
import {
  getAccountByIdAndUserId,
  getAccountsByUserId, getLastUpdatedAccountDate,
  isAccountUpdate, removeAccount,
  saveAccount,
} from '../../service/accountService';
import { SaveAccountReqType } from '../../models/routes/SaveAccountReqType';
import {resError, resOK} from "../../utils/common";
import {saveDeposit} from "../../service/depositService";

const router = new Router();
const userId = 1;

router.get('/', async (ctx) => {
  const { limit } = ctx.query;

  const accounts = await getAccountsByUserId(userId, limit);
  return resOK(ctx, accounts ? accounts : []);
});

router.get('/last-update-date', async (ctx) => {
  const lastUpdateDate = await getLastUpdatedAccountDate(userId);
  return resOK(ctx, lastUpdateDate);
});

router.get('/:accountId', async (ctx) => {
  const { accountId } = ctx.params;

  if (!Number.isInteger(Number(accountId))) {
    return resError({ctx, errorCode: 400, message:  `${accountId} is not allow request param`})
  }

  const account = await getAccountByIdAndUserId(accountId, userId);
  return resOK(ctx, account ? account : {});
});

router.post('/', async (ctx) => {
  const reqType: SaveAccountReqType = ctx.request.body;

  const accountValidation =
    !reqType.title || !reqType.taxType || !reqType.regularTransferDate || !reqType.rate || !reqType.amount;

  if (accountValidation) {
    return resError({ctx, errorCode: 400, message: 'body validation fail' });
  }

  const result = await saveAccount(reqType, userId);
  resOK(ctx, result);
});

router.delete('/:accountId', async (ctx) => {
  const { accountId } = ctx.params;

  if (!Number.isInteger(Number(accountId))) {
    return resError({ctx, errorCode: 400, message:  `accountId: ${accountId} is not allow request param`});
  }

  const result = await removeAccount(Number(accountId), userId);
  resOK(ctx, result);
});


router.get('/:accountId/last-update', async (ctx) => {
  const { lastUpdatedAt } = ctx.query;
  const { accountId } = ctx.params;

  if (!lastUpdatedAt || !accountId || !Number.isInteger(accountId)) {
    return resError({ctx, errorCode: 400, message:  `lastUpdatedAt: ${lastUpdatedAt}, accountId: ${accountId} is not allow request param`});
  }

  const isUpdate = await isAccountUpdate({ id: Number(accountId), userId, lastUpdatedAt });
  resOK(ctx, isUpdate);
});

router.post('/:accountId/deposit', async (ctx) => {
  const { depositDate, amount } = ctx.request.body;
  const { accountId } = ctx.params;

  if (!depositDate || !amount || !Number.isInteger(Number(amount))) {
    return resError({ctx, errorCode: 400, message: 'body validation fail' });
  }
  const result = await saveDeposit({userId, depositDate, amount: Number(amount), accountId: Number(accountId)});
  resOK(ctx, result);
});

export default router;
