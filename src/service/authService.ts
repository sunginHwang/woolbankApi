import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from '../../config';
import { ITokenInfo } from '../models/ITokenInfo';

const { SECRET_TOKEN_KEY, ACCESS_TOKEN_EXPIRE, ACCESS_REFRESH_EXPIRE } = config.authToken;

export const tokenGenerator = (tokenType: 'access' | 'refresh' = 'access', userId: number) => {
  const expireTime = tokenType == 'refresh' ? ACCESS_REFRESH_EXPIRE : ACCESS_TOKEN_EXPIRE;

  return jwt.sign({ userId }, SECRET_TOKEN_KEY, {
    algorithm: 'HS512',
    expiresIn: expireTime
  });
};

export const createAuthToken = (userId: number) => {
  return {
    accessToken: tokenGenerator('access', userId),
    refreshToken: tokenGenerator('refresh', userId)
  };
};

export const getRefreshTokenInfo = async (token: string) => {
  let result: ITokenInfo = {
    userId: -1,
    iat: 0,
    exp: 0
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
