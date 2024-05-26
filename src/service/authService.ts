import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from '../../config';
import { AuthType, ITokenInfo } from '../models/ITokenInfo';
import { UserShareCode } from '../entity/UserShareCode';
import crypto  from 'crypto';

const { SECRET_TOKEN_KEY, ACCESS_TOKEN_EXPIRE, ACCESS_REFRESH_EXPIRE } = config.authToken;

export const tokenGenerator = ({tokenType, userId, loginType} : {tokenType: 'access' | 'refresh'; userId: number; loginType: AuthType}) => {
  const expireTime = tokenType == 'refresh' ? ACCESS_REFRESH_EXPIRE : ACCESS_TOKEN_EXPIRE;

  return jwt.sign({ userId, loginType }, SECRET_TOKEN_KEY, {
    algorithm: 'HS512',
    expiresIn: expireTime
  });
};

export const createAuthToken = (userId: number, loginType: AuthType = 'user') => {
  return {
    accessToken: tokenGenerator({tokenType: 'access', userId, loginType}),
    refreshToken: tokenGenerator({tokenType: 'refresh', userId, loginType}),
  };
};

export const getRefreshTokenInfo = async (token: string) => {
  let result: ITokenInfo = {
    userId: -1,
    authType:'none',
    iat: 0,
    exp: 0
  };

  //@ts-ignore
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

export const upsertShareCode = async (userId: number) => {
  const userShareCode = await getShareCode(userId);

  if (!userShareCode) {
    return await saveShareCode(userId);
  }

  userShareCode.shareCode = crypto.randomUUID();
  const updatedUserShareCode = await userShareCode.save();
  return updatedUserShareCode.shareCode;
}


export const getShareCode = async ( userId: number) => {
  return await UserShareCode.findOne({     
     where: { userId }
  });
};


export const getShareCodeInfoByShareCode = async ( shareCode: string) => {
  return await UserShareCode.findOne({     
     where: { shareCode }
  });
};

export const saveShareCode = async ( userId: number) => {
  const userShareCode = new UserShareCode();
  userShareCode.userId = userId;
  userShareCode.shareCode = crypto.randomUUID();

  const newUserShareCode = await userShareCode.save();
  return newUserShareCode.shareCode;
};


