import { Next } from 'koa';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { ITokenInfo } from '../models/ITokenInfo';
import { resError, setAuthCookie } from '../utils/common';
import { CustomExtendableContext } from '../models/CustomExtendableContext';
import config from '../../config';
import { createAuthToken, getRefreshTokenInfo } from '../service/authService';

const { SECRET_TOKEN_KEY, ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } = config.authToken;

const isAuthenticated = async (ctx: CustomExtendableContext, next: Next) => {
  const accessToken = ctx.cookies.get(ACCESS_TOKEN_NAME);
  const refreshToken = ctx.cookies.get(REFRESH_TOKEN_NAME);
  
  if (!accessToken) {
    return resError({ ctx, errorCode: 401, message: '인증 토큰 정보가 존재하지 않습니다.' });
  }

  try {
    let verifyErrorMsg = '인증정보가 다릅니다.';
    //@ts-ignore
    await jwt.verify(accessToken as any, SECRET_TOKEN_KEY, async (err: VerifyErrors | null, decoded: object | undefined) => {

      if (err) {
        if (err.name === 'TokenExpiredError' && refreshToken) {
          const tokenInfo = await getRefreshTokenInfo(refreshToken);
          const authTokens = createAuthToken(tokenInfo.userId, tokenInfo.authType);
          setAuthCookie(ctx, authTokens.accessToken, authTokens.refreshToken);
          ctx.userId = tokenInfo.userId;
          ctx.authType = tokenInfo.authType;

          await next();
          return;
        }
        verifyErrorMsg = err.message;
        return;
      }

      if (decoded) {
        ctx.userId = (decoded as ITokenInfo).userId;
        // 변경 필요
        ctx.authType = (decoded as any).loginType;
        await next();
        return;
      }


    });

    if (!ctx.userId) {
      return resError({ ctx, errorCode: 401, message: verifyErrorMsg });
    }
  } catch (e) {
    console.log(e);
    return resError({ ctx, errorCode: 401, message: '토튼 인증 실패' });
  }

};

export default isAuthenticated;
