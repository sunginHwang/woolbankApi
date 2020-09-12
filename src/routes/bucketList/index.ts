import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import {
  getBucketListByUserId,
  getBucketListById,
  getBucketListLastUpdatedDate,
  removeBucketList,
  saveBucketList,
  updateBucketList,
  getLastUpdatedBucketListDate
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

  const savedBucketList = await saveBucketList(reqType, userId);

  if (!savedBucketList) {
    return resError({ ctx, errorCode: 500, message: 'not saved bucketList' });
  }

  resOK(ctx, {
    bucketListId: savedBucketList.id
  });
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

  const bucketListDetail = await getBucketListById(Number(bucketListId), userId, true);

  if (!bucketListDetail) {
    return resError({ ctx, errorCode: 404, message: `bucketList not found, bucketListId: ${bucketListId} ` });
  }

  return resOK(ctx, bucketListDetail);
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

  const updatedBucketList = await updateBucketList({ id: bucketListId, updateReq: reqType, userId });

  if (!updatedBucketList) {
    return resError({ ctx, errorCode: 500, message: 'not updated bucketList' });
  }

  resOK(ctx, { bucketListId: updatedBucketList.id });
});

router.delete('/:bucketListId', async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const result = await removeBucketList(bucketListId, userId);
  resOK(ctx, result);
});

router.get('/:bucketListId/last-update-date', async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!bucketListId || !Number.isInteger(Number(bucketListId))) {
    return resError({
      ctx,
      errorCode: 400,
      message: ` bucketListId: ${bucketListId} is not allow request param`
    });
  }

  const result = await getLastUpdatedBucketListDate(Number(bucketListId), userId);
  return resOK(ctx, result);
});

export default router;
