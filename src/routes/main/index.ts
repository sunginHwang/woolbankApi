import Router from '@koa/router';
import { resOK } from '../../utils/common';
import {getNotExpirationAccounts, getSavedAmount} from "../../service/accountService";
import {getBucketListByUserId} from "../../service/bucketListService";
import {MainInfoResType} from "../../models/routes/MainInfoResType";

const router = new Router();
const userId = 1;


router.get('/', async (ctx) => {
    const [accounts, bucketList, amount] = await Promise.all([getNotExpirationAccounts(userId, 3), getBucketListByUserId(userId, 3), getSavedAmount(userId)])

    const res: MainInfoResType = {
        amount,
        accounts,
        bucketList,
    };

    return resOK(ctx, res);
});

export default router;
