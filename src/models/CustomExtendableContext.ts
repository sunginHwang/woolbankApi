import {ExtendableContext} from "koa";

export interface CustomExtendableContext extends ExtendableContext{
    userId: number;
}
