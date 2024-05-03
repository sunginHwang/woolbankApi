import {ExtendableContext} from "koa";
import {IRes} from "../models/IRes";
import config from '../../config';

const {  ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } = config.authToken;

export const resOK = <T>(ctx: ExtendableContext, res: T) => {
    const okRes: IRes<T> = {
        status: 200,
        data: res
    }

    ctx.status = okRes.status;
    ctx.body = okRes;
}

export const resError = ({ctx, errorCode, message}: {ctx: ExtendableContext, errorCode: number, message: string}) => {
    const errorRes: IRes<{message: string}> = {
        status: errorCode,
        data: {
          message
        }
    }

    ctx.status = errorRes.status;
    ctx.body = errorRes;
}


export const setAuthCookie = (ctx: ExtendableContext, accessToken: string, refreshToken: string) => {
    ctx.cookies.set(ACCESS_TOKEN_NAME, accessToken,  {httpOnly: true, secure: true, sameSite: 'none'});
    ctx.cookies.set(REFRESH_TOKEN_NAME, refreshToken,  {httpOnly: true, secure: true, sameSite: 'none'});
}