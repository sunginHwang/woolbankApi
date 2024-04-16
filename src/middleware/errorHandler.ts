import {ExtendableContext, Next} from "koa";
import {IRes} from "../models/IRes";

const errorHandler = async (ctx: ExtendableContext, next: Next) => {
    try {
        await next()
    } catch (e) {
        const errorRes: IRes<{ error: string; message: string }> = {
            status: (e as { status?: number }).status || 500,
            data: {
                error: JSON.stringify(e),
                message: (e as { message?: string }).message || '오류가 발생하였습니다.'
            }
        }
        ctx.status = errorRes.status
        ctx.body = errorRes;
    }
};

export default errorHandler;
