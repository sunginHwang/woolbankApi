import Router from '@koa/router';
import { resOK } from "../../utils/common";
import { getBucketList } from "../../service/bucketListService";

const router = new Router();
const userId = 1;

router.get('/', async (ctx) => {
    const bucketList = await getBucketList(userId);
    return resOK(ctx, bucketList ? bucketList : []);
});

export default router;
