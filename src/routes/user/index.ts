import Router from '@koa/router';
import { SocialLoginReq } from '../../models/routes/SocialLoginReq';
import { getSocialUser, getUserWithToken, saveSocialUser } from '../../service/userService';
import { resError, resOK } from '../../utils/common';

const router = new Router();

router.post('/login/social', async (ctx) => {
  const loginReq: SocialLoginReq = ctx.request.body;
  const userInfo = await getSocialUser(loginReq.socialId, loginReq.loginType);

  // 가입된 유저는 로그인 정보 반환
  if (userInfo) {
    const userRes = getUserWithToken(userInfo);
    return resOK(ctx, userRes);
  }

  // 회원가입 안되있는 경우 자동 회원가입 후 로그인 처리
  const savedUser = await saveSocialUser(loginReq);

  if (!savedUser) {
    return resError({ ctx, errorCode: 500, message: 'social register fail' });
  }

  const userRes = getUserWithToken(savedUser);
  return resOK(ctx, userRes);
});

export default router;
