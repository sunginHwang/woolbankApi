import Router from '@koa/router';
import {User} from "../../entity/User";

const router = new Router();

router.get('/check', async ctx => {
    const allUsers = await User.find();
    ctx.body = {
        allUsers,
    };
});


export default router;