import Router from '@koa/router';
import { resOK } from '../../utils/common';
import {getNotExpirationAccounts, getSavedAmount} from "../../service/accountService";
import {getBucketListByUserId} from "../../service/bucketListService";
import {MainInfoResType} from "../../models/routes/MainInfoResType";
import isAuthenticated from "../../middleware/isAuthenticated";
import { scheduleRegularExpenditure } from '../../service/regularExpenditureService';

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {
    const { userId } = ctx;
    const [accounts, bucketList, { totalSavedAmount, totalSavedAmountExceptCurrentMonth }] = await Promise.all([getNotExpirationAccounts(userId, 3), getBucketListByUserId(userId, 3), getSavedAmount(userId)]);

    const res: MainInfoResType = {
        totalSavedAmount,
        totalSavedAmountExceptCurrentMonth,
        accounts,
        bucketList,
    };

    return resOK(ctx, res);
});

router.get('/test',  async (ctx) => {
    console.log('test');
    scheduleRegularExpenditure();

    return resOK(ctx, 'ok');
});



export default router;
