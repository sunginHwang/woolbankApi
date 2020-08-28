import { Next } from 'koa';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { ITokenInfo } from '../models/ITokenInfo';
import { resError } from '../utils/common';
import { CustomExtendableContext } from '../models/CustomExtendableContext';
import config from '../../config';

const { SECRET_TOKEN_KEY, ACCESS_HEADER_TOKEN } = config.authToken;

const isAuthenticated = async (ctx: CustomExtendableContext, next: Next) => {
  let isAuthenticated = false;
  const token = ctx.request.header[ACCESS_HEADER_TOKEN];

  if (!token) {
    return resError({ ctx, errorCode: 401, message: '인증 토큰 정보가 존재하지 않습니다.' });
  }

  try {
    let verifyErrorMsg = '';

    await jwt.verify(token, SECRET_TOKEN_KEY, (err: VerifyErrors | null, decoded: object | undefined) => {
      if (err) {
        verifyErrorMsg = err.message;
        return;
      }

      if (decoded) {
        ctx.userId = (decoded as ITokenInfo).userId;
        isAuthenticated = true;
      } else {
        verifyErrorMsg = '인증정보가 다릅니다.';
      }
    });

    if (!ctx.userId) {
      return resError({ ctx, errorCode: 401, message: verifyErrorMsg });
    }
  } catch (e) {
    return resError({ ctx, errorCode: 401, message: '토튼 인증 실패' });
  }

  await next();
};

export default isAuthenticated;
