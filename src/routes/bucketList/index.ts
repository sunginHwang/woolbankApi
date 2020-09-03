import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import {
  getBucketListByUserId,
  getBucketListById,
  getBucketListLastUpdatedDate,
  removeBucketList,
  saveBucketList,
  updateBucketList, getLastUpdatedBucketListDate
} from '../../service/bucketListService';
import { SaveBucketListReqType } from '../../models/routes/SaveBucketListReqType';
import { BucketListResType } from '../../models/routes/BucketListResType';

const router = new Router();
const userId = 1;

router.get('/', async (ctx) => {
  const bucketList = await getBucketListByUserId(userId);
  const bucketListRes = bucketList.map<BucketListResType>((bucket) => ({
    id: bucket.id,
    title: bucket.title,
    completeDate: bucket.completeDate,
    todoCount: bucket.todoList.length,
    completeTodoCount: bucket.todoList.filter((todo) => todo.isComplete).length,
    thumbImageUrl: bucket.thumbImageUrl,
    updatedAt: bucket.updatedAt
  }));

  return resOK(ctx, bucketListRes ? bucketListRes : []);
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
