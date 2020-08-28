import {SocialType} from "../SocialType";

export interface SocialLoginReq {
    name: string;
    email: string;
    imageUrl: string;
    loginType: SocialType;
    socialId: string;
}
