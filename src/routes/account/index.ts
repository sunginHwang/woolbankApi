import Router from '@koa/router';
import {User} from "../../entity/User";
import {Account} from "../../entity/Account";
import {SavingType} from "../../entity/SavingType";

const router = new Router();
const userId = 1;

router.get('/', async ctx => {

    try {
        const accounts = await Account.find({relations: ['savingType'], where : { userId }});
        ctx.body = { accounts };
    } catch (e) {
        ctx.throw(500, e);
    }
});


router.get('/:accountId', async ctx => {
    const { accountId } = ctx.params;

    if(Number.isInteger(Number(accountId))) {
        ctx.status = 400;

        ctx.body = {
            errorCode: 400,
            message: 'req validation fail'
        };
        return '';
    }

    try {
        const accounts = await Account.findOne({id: accountId, userId});
    } catch (e) {
        ctx.throw(500, e);
    }

});

router.post('/', async ctx => {
    const account = ctx.request.body;
    console.log(account);

    const accountValidation = !account.title || !account.taxType || !account.regularTransferDate || !account.rate || !account.amount;

    if(accountValidation) {
        ctx.status = 400;

        ctx.body = {
            errorCode: 400,
            message: 'body validation fail'
        };
        return '';
    }

    try {
        const savingType = await SavingType.findOne({id: account.savingTypeId});
            console.log(account.saveTypeId);
            console.log(savingType);
            console.log('- durl0');

            if(!savingType) {
            ctx.status = 400;

            ctx.body = {
                errorCode: 400,
                message: 'can`t find savingType'
            };
            return '';
        }

        const savingAccount = Object.assign(account, {savingType});
        console.log('---s---');
        console.log(savingType);
        console.log(savingAccount);
        ctx.body = {
            savingAccount
        }
    } catch (e) {
        ctx.throw(500, e);
    }

});

router.get('/:accountId/last-update', async ctx => {
    const { lastUpdatedAt } = ctx.query;
    let { accountId } = ctx.params;
    accountId = Number(accountId);

    if(!lastUpdatedAt || !Number.isInteger(accountId)) {
        ctx.status = 400;

        ctx.body = {
            errorCode: 400,
            message: 'req validation fail'
        };
        return '';
    }

    const account = await Account.findOne({ id: accountId, userId });

    if(!account) {
        ctx.status = 400;
        ctx.body = {
            errorCode: 400,
            message: 'account is not found'
        };
        return '';
    }

    const accountLastUpdatedAt = account.updatedAt;
    const isUpdate = accountLastUpdatedAt.getTime() === (new Date(lastUpdatedAt)).getTime();
    ctx.body = {
        isUpdate,
    };
});


export default router;
