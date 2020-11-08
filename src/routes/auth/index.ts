import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import { createAuthToken, getRefreshTokenInfo } from '../../service/authService';
import { getUserById } from '../../service/userService';
import { CustomExtendableContext } from '../../models/CustomExtendableContext';
import isAuthenticated from '../../middleware/isAuthenticated';
import CommonError from '../../error/CommonError';

const router = new Router();

router.get('/access-check', isAuthenticated, async (ctx: CustomExtendableContext) => {
  return resOK(ctx, { userId: ctx.userId });
});

router.get('/check', isAuthenticated, async (ctx: CustomExtendableContext) => {
  try {
    const userInfo = await getUserById(ctx.userId);

    if (userInfo === undefined) {
      new CommonError(`userId: ${ctx.userId} is not exist user`, 401);
      return;
    }

    delete userInfo.password;
    const authTokens = createAuthToken(userInfo?.id);

    return resOK(ctx, { userInfo, authTokens });

  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e });
  }
});

router.post('/refresh-token-check', async (ctx) => {
  const { refreshToken } = ctx.request.body;

  try {
    const tokenInfo = await getRefreshTokenInfo(refreshToken);
    const authTokens = createAuthToken(tokenInfo.userId);
    return resOK(ctx, { authTokens });
  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e });
  }
});

export default router;
