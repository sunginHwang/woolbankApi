import Router from '@koa/router';
import {User} from "../../entity/User";
import {Account} from "../../entity/Account";

const router = new Router();

router.get('/check', async ctx => {
    const allUsers = await User.find();
    ctx.body = {
        allUsers,
    };
});

router.get('/list', async ctx => {
    const accounts = await Account.find({relations: ['user', 'savingType', 'deposits']});
    accounts.forEach(console.log);
    ctx.body = {
        accounts,
    };
});


export default router;