import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import { createAuthToken, getRefreshTokenInfo } from '../../service/authService';
import { CustomExtendableContext } from '../../models/CustomExtendableContext';
import isAuthenticated from '../../ middleware/isAuthenticated';

const router = new Router();

router.get('/access-check', isAuthenticated, async (ctx: CustomExtendableContext) => {
  return resOK(ctx, { userId: ctx.userId });
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
