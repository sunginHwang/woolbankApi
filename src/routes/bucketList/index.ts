import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import {
  getBucketListByUserId,
  getBucketListById,
  getBucketListLastUpdatedDate,
  isBucketListUpdate, removeBucketList,
  saveBucketList,
  updateBucketList
} from '../../service/bucketListService';
import { SaveBucketListReqType } from '../../models/routes/SaveBucketListReqType';

const router = new Router();
const userId = 1;

router.get('/', async (ctx) => {
  const bucketList = await getBucketListByUserId(userId);
  return resOK(ctx, bucketList ? bucketList : []);
});

router.post('/', async (ctx) => {
  const reqType: SaveBucketListReqType = ctx.request.body;

  const bucketListValidation = !reqType.title || !reqType.description || !reqType.completeDate;

  if (bucketListValidation) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const result = await saveBucketList(reqType, userId);
  resOK(ctx, result);
});

router.get('/last-update-date', async (ctx) => {
  const lastUpdateDate = await getBucketListLastUpdatedDate(userId);
  return resOK(ctx, lastUpdateDate);
});

router.get('/:bucketListId', async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const result = await getBucketListById(Number(bucketListId), userId, true);
  return resOK(ctx, result);
});

router.put('/:bucketListId', async (ctx) => {
  const { bucketListId } = ctx.params;
  const reqType: SaveBucketListReqType = ctx.request.body;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const bucketListValidation = !reqType.title || !reqType.description || !reqType.completeDate;

  if (bucketListValidation) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  const result = await updateBucketList({ id: bucketListId, updateReq: reqType, userId });
  resOK(ctx, result);
});

router.delete('/:bucketListId', async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const result = await removeBucketList(bucketListId, userId);
  resOK(ctx, result);
});

router.get('/:bucketListId/last-update', async (ctx) => {
  const { lastUpdatedAt } = ctx.query;
  const { bucketListId } = ctx.params;

  if (!lastUpdatedAt || !bucketListId || !Number.isInteger(Number(bucketListId))) {
    return resError({
      ctx,
      errorCode: 400,
      message: `lastUpdatedAt: ${lastUpdatedAt}, bucketListId: ${bucketListId} is not allow request param`
    });
  }

  const result = await isBucketListUpdate({ id: Number(bucketListId), lastUpdatedAt, userId });
  return resOK(ctx, result);
});

export default router;
