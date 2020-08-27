import jwt, { VerifyCallback, VerifyErrors } from 'jsonwebtoken';
import { ExtendableContext, Next } from 'koa';
import { resError } from '../utils/common';
import { CustomExtendableContext } from '../models/CustomExtendableContext';
/*암호해쉬정보들*/
const HASH_TYPE = 'sha512';
const HASH_DIGEST = 'hex';
const SECRET_TOKEN_KEY = 'haeJin';

/*리프레쉬 토큰*/
const REFRESH_MODE = 'refresh';
const ACCESS_MODE = 'access';

const ACCESS_TOKEN_EXPIRE = '5s';
const ACCESS_REFRESH_EXPIRE = '60d';
const ACCESS_HEADER_TOKEN = 'bearer_auth';
const ERROR_JWT_EXPIRED = 'jwt expired';

export const tokenGenerator = (tokenType = ACCESS_MODE, userId: number) => {
  const expireTime = tokenType == REFRESH_MODE ? ACCESS_REFRESH_EXPIRE : ACCESS_TOKEN_EXPIRE;

  return jwt.sign(
    {
      userId
    },
    SECRET_TOKEN_KEY,
    {
      algorithm: 'HS512',
      expiresIn: expireTime
    }
  );
};

export const createRefreshToken = (userId: number) => {
  return {
    userId,
    accessToken: tokenGenerator(ACCESS_MODE, userId),
    refreshToken: tokenGenerator(REFRESH_MODE, userId)
  };
};

interface ITokenInfo {
  userId: number;
  iat: number;
  exp: number;
}

export const isAuthenticated = async (ctx: CustomExtendableContext, next: Next) => {
  let isAuthenticated = false;
  const token = ctx.request.header[ACCESS_HEADER_TOKEN];

  if (!token) {
    return resError({ ctx, errorCode: 401, message: '인증 실패' });
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
        verifyErrorMsg = 'not exist decode token info';
      }
    });

    if( !ctx.userId ) {
      return resError({ ctx, errorCode: 401, message: verifyErrorMsg });
    }

  } catch (e) {
    return resError({ ctx, errorCode: 401, message: '토큰 해쉬 실패' });
  }

  await next();
};

export const isAuthenticatedTwo = async (token: string) => {
  let result: ITokenInfo = {
    userId: -1,
    iat: 0,
    exp: 0,
  };

  await jwt.verify(token, SECRET_TOKEN_KEY, (err: VerifyErrors | null, decoded: object | undefined) => {
    if (err) {
      throw Error(err.message);
    }

    if (decoded) {
      result = decoded as ITokenInfo;
    } else {
      throw Error('not exist decode token info');
    }
  });

  return result;
};
