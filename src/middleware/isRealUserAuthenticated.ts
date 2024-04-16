import { Next } from 'koa';
import { resError } from '../utils/common';
import { CustomExtendableContext } from '../models/CustomExtendableContext';


const isRealUserAuthenticated = async (ctx: CustomExtendableContext, next: Next) => {


  if (ctx.authType !== 'user') {
    return resError({ ctx, errorCode: 401, message: '권한이 없습니다.' });
  }

  await next();
    return;
};

export default isRealUserAuthenticated;
