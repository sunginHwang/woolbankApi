import Router from '@koa/router';
import {resError, resOK} from "../../utils/common";
import {createRefreshToken, isAuthenticated, isAuthenticatedTwo} from "../../service/authService";
import {CustomExtendableContext} from "../../models/CustomExtendableContext";
import {getUserById} from "../../service/userService";

const router = new Router();
const userId = 1;



router.get('/', async (ctx) => {
    const accessInfo = createRefreshToken(userId);
    return resOK(ctx, accessInfo);
});

router.get('/login/social', async (ctx) => {
    const userId = 1;
    const userInfo = await getUserById(userId);

    if (!userInfo) {
        return resError({ctx, errorCode: 402, message:'userInfo not found'});
    }

    const authTokens = createRefreshToken(userInfo.id);

    return resOK(ctx, {
        userInfo,
        ...authTokens,
    });
});

router.get('/access-check',isAuthenticated,  async (ctx: CustomExtendableContext) => {
    console.log('여기 와?');
    return resOK(ctx, {userId: ctx.userId});
});

router.post('/refresh-token',  async (ctx) => {
    const {refreshToken} = ctx.request.body;
    console.log(refreshToken);

    try {
        const userInfo = await isAuthenticatedTwo(refreshToken);
        const authTokens = createRefreshToken(userInfo.userId);
        return resOK(ctx, {authTokens});
    }catch (e) {
        console.log(e);
    }

});

export default router;
