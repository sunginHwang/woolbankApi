import Router from '@koa/router';
import { resError, resOK } from '../../utils/common';
import { createAuthToken, getRefreshTokenInfo, getShareCode, upsertShareCode } from '../../service/authService';
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

    if (!userInfo) {
      new CommonError(`userId: ${ctx.userId} is not exist user`, 401);
      return;
    }

    //@ts-ignore
    delete userInfo.password;
    const authTokens = createAuthToken(userInfo?.id);

    return resOK(ctx, { userInfo, authTokens });

  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e  as string });
  }
});

router.post('/refresh-token-check', async (ctx) => {
  const { refreshToken } = ctx.request.body as any;

  try {
    const tokenInfo = await getRefreshTokenInfo(refreshToken);
    const authTokens = createAuthToken(tokenInfo.userId);
    return resOK(ctx, { authTokens });
  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e  as string });
  }
});

router.post('/share-code', isAuthenticated, async (ctx: CustomExtendableContext) => {
  const userInfo = await getUserById(ctx.userId);

  if (userInfo === undefined) {
    new CommonError(`userId: ${ctx.userId} is not exist user`, 401);
    return;
  }

  try {
    const shareCode = await upsertShareCode(ctx.userId);
    return resOK(ctx, { shareCode });
  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e  as string });
  }
});

router.get('/share-code', isAuthenticated, async (ctx: CustomExtendableContext) => {
  const userInfo = await getUserById(ctx.userId);

  if (userInfo === undefined) {
    new CommonError(`userId: ${ctx.userId} is not exist user`, 401);
    return;
  }

  try {
    const upsertShareCode = await getShareCode(ctx.userId);
    return resOK(ctx, { shareCode: upsertShareCode?.shareCode ?? '' });
  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e  as string });
  }
});

router.get('/share-code-login',  async (ctx: CustomExtendableContext) => {
  const { shareCode } = ctx.query as any;


  const userShareCode = await getShareCode(shareCode);

  if (!userShareCode) {
    new CommonError(`share-code: ${shareCode} is not exist share-code`, 401);
    return;
  }

  const userInfo = await getUserById(userShareCode.userId);

  if (userInfo === undefined) {
    new CommonError(`userId: ${ctx.userId} is not exist user`, 401);
    return;
  }

  try {
    const upsertShareCode = await getShareCode(ctx.userId);
    return resOK(ctx, { shareCode: upsertShareCode?.shareCode ?? '' });
  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e  as string });
  }
});

export default router;
