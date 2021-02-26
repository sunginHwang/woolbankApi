import Router from "@koa/router";

import isAuthenticated from "../../middleware/isAuthenticated";
import {
    getRegularExpenditureListByUserId,
    removeRegularExpenditure,
    saveRegularExpenditure
} from "../../service/regularExpenditureService";
import {resError, resOK} from "../../utils/common";
import {SaveRegularExpenditureReqType} from "../../models/routes/SaveRegularExpenditureReqType";

const router = new Router();


router.get('/', isAuthenticated, async (ctx) => {
    const { limit } = ctx.query;
    const regularExpenditures = await getRegularExpenditureListByUserId(ctx.userId, limit);

    return resOK(ctx, regularExpenditures ? regularExpenditures : []);
});


router.post('/', isAuthenticated, async (ctx) => {
    const reqType: SaveRegularExpenditureReqType = ctx.request.body;
    const isNowAllowValidation = reqType?.title === '' || reqType?.amount < 0 || reqType?.regularDate < 0 || reqType?.expenditureTypeId < 0;

    if (isNowAllowValidation) {
        return resError({ ctx, errorCode: 400, message: 'body validation fail' });
    }

    const regularExpenditure = await saveRegularExpenditure(reqType, ctx.userId);

    if (!regularExpenditure) {
        return resError({ ctx, errorCode: 500, message: 'not saved regularExpenditure' });
    }

    resOK(ctx, {
        regularExpenditureId: regularExpenditure.id
    });
});

router.delete('/:regularExpenditureId', isAuthenticated, async (ctx) => {
    const { regularExpenditureId } = ctx.params;

    if (!Number.isInteger(Number(regularExpenditureId))) {
        return resError({ ctx, errorCode: 400, message: `regularExpenditureId: ${regularExpenditureId} is not allow request param` });
    }

    const result = await removeRegularExpenditure(regularExpenditureId);
    resOK(ctx, result);
});

export default router;
