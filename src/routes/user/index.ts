import Router from '@koa/router';
import { SocialLoginReq } from '../../models/routes/SocialLoginReq';
import { getSocialUser, getUserById, getUserWithToken, saveSocialUser } from '../../service/userService';
import { resError, resOK, setAuthCookie } from '../../utils/common';
import config from '../../../config';
import { getShareCodeInfoByShareCode } from '../../service/authService';
import CommonError from '../../error/CommonError';
import isAuthenticated from '../../middleware/isAuthenticated';
import { CustomExtendableContext } from '../../models/CustomExtendableContext';
const {  ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } = config.authToken;

const  router = new Router();

router.get('/', isAuthenticated, async (ctx: CustomExtendableContext) => {
  try {
    const userInfo = await getUserById(ctx.userId);

    if (userInfo === undefined) {
      new CommonError(`userId: ${ctx.userId} is not exist user`, 401);
      return;
    }


    //@ts-ignore
    delete userInfo.password;
    const userInfoRes = {...userInfo, authType: ctx.authType };

    return resOK(ctx, userInfoRes);

  } catch (e) {
    return resError({ ctx, errorCode: 401, message: e  as string });
  }
});

router.post('/login/social', async (ctx) => {
  const loginReq: SocialLoginReq = ctx.request.body as SocialLoginReq;
  const userInfo = await getSocialUser('113980341083226565334', 'google');

  // 가입된 유저는 로그인 정보 반환
  if (userInfo) {
    const userRes = getUserWithToken(userInfo);
    setAuthCookie(ctx, userRes.accessToken, userRes.refreshToken);
    return resOK(ctx, userRes);
  }

  // 회원가입 안되있는 경우 자동 회원가입 후 로그인 처리
  const savedUser = await saveSocialUser(loginReq);

  if (!savedUser) {
    return resError({ ctx, errorCode: 500, message: 'social register fail' });
  }

  const userRes = getUserWithToken(savedUser);
  setAuthCookie(ctx, userRes.accessToken, userRes.refreshToken);

  return resOK(ctx, userRes);
});

router.post('/logout', async (ctx) => {
  setAuthCookie(ctx, '','');

  return resOK(ctx, '');
});

router.post('/share-code-login',  async (ctx) => {

  const { shareCode }: {shareCode: string} = ctx.request.body as {shareCode: string};

  const userShareCode = await getShareCodeInfoByShareCode(shareCode);

  if (userShareCode === undefined) {
    throw new CommonError(`share-code: ${shareCode} is not exist share-code`, 401);
  }

  const userInfo = await getUserById(userShareCode.userId);

  if (userInfo === undefined) {
    throw new CommonError(`share-code: ${shareCode} is not exist share-code user-info`, 401);
  }

  const userRes = getUserWithToken(userInfo, 'share');
  setAuthCookie(ctx, userRes.accessToken, userRes.refreshToken);

  return resOK(ctx, userRes);
});

export default router;

