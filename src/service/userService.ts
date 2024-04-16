import crypto  from 'crypto';
import { getConnection } from "typeorm";
import { User } from '../entity/User';
import { SocialType } from '../models/SocialType';
import { SocialLoginReq } from '../models/routes/SocialLoginReq';
import { createAuthToken } from './authService';
import { AuthType } from '../models/ITokenInfo';

export const getUserById = async (id: number) => {
  return User.findOne({ where: { id } });
};

export const getSocialUser = async (socialId: string, loginType: SocialType) => {
  const socialUser = await User.findOne({ where: { socialId, loginType } });

  if (socialUser) {
     //@ts-ignore
    delete socialUser.password;
  }

  return socialUser;
};

export const saveSocialUser = async (req: SocialLoginReq) => {

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const user = new User();
        user.name = req.name || '';
        user.password = req.socialId;
        user.email = req.email || '';
        user.profileImg = req.imageUrl;
        user.loginType = req.loginType;
        user.socialId = req.socialId;

        const savedUser = await User.save(user);

        savedUser.password = getPassword(savedUser.socialId, savedUser.id.toString())
        await User.save(savedUser);

        await queryRunner.commitTransaction();

        // 암호 노출 방지
        //@ts-ignore
        delete savedUser.password;
        return savedUser;
    } catch (e) {
        await queryRunner.rollbackTransaction();
        return null;
    } finally {
        await queryRunner.release();
    }
};

export const getUserWithToken = (user: User, loginType: AuthType = 'user') => {
    const tokenInfo = createAuthToken(user.id, loginType);
    return {user, ...tokenInfo};
}


const getPassword = (id:string, salt:string) => {
    return crypto.scryptSync(id, salt, 64, { N: 1024 }).toString('hex');
}
