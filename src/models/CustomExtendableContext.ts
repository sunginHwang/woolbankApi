//@ts-ignore

import {ExtendableContext} from "koa";
import { ITokenInfo } from "./ITokenInfo";

export interface CustomExtendableContext extends ExtendableContext, Pick<ITokenInfo, 'authType'>{
    userId: number;
}
