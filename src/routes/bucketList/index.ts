import Router from '@koa/router';
import {resError, resOK} from "../../utils/common";
import {getBucketList, getBucketListById} from "../../service/bucketListService";

const router = new Router();
const userId = 1;

router.get('/', async (ctx) => {
    const bucketList = await getBucketList(userId);
    return resOK(ctx, bucketList ? bucketList : []);
});

router.get('/:bucketListId', async (ctx) => {
    const { bucketListId } = ctx.params;

    if (!Number.isInteger(Number(bucketListId))) {
        return resError({ctx, errorCode: 400, message:  `bucketListId: ${bucketListId} is not allow request param`});
    }

    const result = await getBucketListById(Number(bucketListId), userId);
    return resOK(ctx, result);
});

export default router;
