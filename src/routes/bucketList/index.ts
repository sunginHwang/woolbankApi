import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import { imageUpload } from '../../utils/upload';

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
import isAuthenticated from "../../middleware/isAuthenticated";

const router = new Router();

router.get('/', isAuthenticated,async (ctx) => {
  const bucketList = await getBucketListByUserId(ctx.userId);

  return resOK(ctx, bucketList ? bucketList : []);
});

router.post('/', isAuthenticated, async (ctx) => {
  const reqType: SaveBucketListReqType = ctx.request.body;
  const file = ctx.request.files ? ctx.request.files.image : null;

  if (typeof reqType.todoList === 'string') {
    reqType.todoList = JSON.parse(reqType.todoList);
  }

  const bucketListValidation = !reqType.title || !reqType.description || !reqType.completeDate;

  if (bucketListValidation) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }

  if (file) {
    const image = await imageUpload(file);
    reqType.imageUrl = image?.imageUrl;
    reqType.thumbImageUrl = image?.thumbImageUrl;
  }

  const savedBucketList = await saveBucketList(reqType, ctx.userId);

  if (!savedBucketList) {
    return resError({ ctx, errorCode: 500, message: 'not saved bucketList' });
  }

  resOK(ctx, {
    bucketListId: savedBucketList.id
  });
});

router.get('/last-update-date',isAuthenticated, async (ctx) => {
  const lastUpdateDate = await getBucketListLastUpdatedDate(ctx.userId);
  return resOK(ctx, lastUpdateDate);
});

router.get('/:bucketListId', isAuthenticated, async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const bucketListDetail = await getBucketListById(Number(bucketListId), ctx.userId, true);

  if (!bucketListDetail) {
    return resError({ ctx, errorCode: 404, message: `bucketList not found, bucketListId: ${bucketListId} ` });
  }

  return resOK(ctx, bucketListDetail);
});

router.put('/:bucketListId', isAuthenticated,async (ctx) => {
  const { bucketListId } = ctx.params;
  const reqType: SaveBucketListReqType = ctx.request.body;
  const file = ctx.request.files ? ctx.request.files.image : null;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const bucketListValidation = !reqType.title || !reqType.description || !reqType.completeDate;

  if (bucketListValidation) {
    return resError({ ctx, errorCode: 400, message: 'body validation fail' });
  }


  if (file) {
    const image = await imageUpload(file);
    reqType.imageUrl = image?.imageUrl;
    reqType.thumbImageUrl = image?.thumbImageUrl;
  }

  const updatedBucketList = await updateBucketList({ id: bucketListId, updateReq: reqType, userId: ctx.userId });

  if (!updatedBucketList) {
    return resError({ ctx, errorCode: 500, message: 'not updated bucketList' });
  }

  resOK(ctx, { bucketListId: updatedBucketList.id });
});

router.delete('/:bucketListId', isAuthenticated, async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!Number.isInteger(Number(bucketListId))) {
    return resError({ ctx, errorCode: 400, message: `bucketListId: ${bucketListId} is not allow request param` });
  }

  const result = await removeBucketList(bucketListId, ctx.userId);
  resOK(ctx, result);
});

router.get('/:bucketListId/last-update-date', isAuthenticated, async (ctx) => {
  const { bucketListId } = ctx.params;

  if (!bucketListId || !Number.isInteger(Number(bucketListId))) {
    return resError({
      ctx,
      errorCode: 400,
      message: ` bucketListId: ${bucketListId} is not allow request param`
    });
  }

  const result = await getLastUpdatedBucketListDate(Number(bucketListId), ctx.userId);
  return resOK(ctx, result);
});

export default router;
