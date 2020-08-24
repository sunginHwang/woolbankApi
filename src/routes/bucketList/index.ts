import Router from '@koa/router';
import {resError, resOK} from "../../utils/common";
import {
    getBucketList,
    getBucketListById,
    getBucketListLastUpdatedDate,
    isBucketListUpdate
} from "../../service/bucketListService";

const router = new Router();
const userId = 1;

router.get('/', async (ctx) => {
    const bucketList = await getBucketList(userId);
    return resOK(ctx, bucketList ? bucketList : []);
});

router.get('/last-update-date', async (ctx) => {
    const lastUpdateDate = await getBucketListLastUpdatedDate(userId);
    return resOK(ctx, lastUpdateDate);
});

router.get('/:bucketListId', async (ctx) => {
    const { bucketListId } = ctx.params;

    if (!Number.isInteger(Number(bucketListId))) {
        return resError({ctx, errorCode: 400, message:  `bucketListId: ${bucketListId} is not allow request param`});
    }

    const result = await getBucketListById(Number(bucketListId), userId);
    return resOK(ctx, result);
});

router.get('/:bucketListId/last-update', async (ctx) => {
    const { lastUpdatedAt } = ctx.query;
    const { bucketListId } = ctx.params;

    if (!lastUpdatedAt || !bucketListId || !Number.isInteger(Number(bucketListId))) {
        return resError({ctx, errorCode: 400, message:  `lastUpdatedAt: ${lastUpdatedAt}, bucketListId: ${bucketListId} is not allow request param`});
    }

    const result = await isBucketListUpdate({id: Number(bucketListId), lastUpdatedAt, userId});
    return resOK(ctx, result);
});

export default router;
