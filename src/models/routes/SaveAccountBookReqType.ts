import {AccountBookCategoryType} from "../AccountBookCategoryType";

export interface SaveAccountBookReqType {
    title: string;
    categoryId: number;
    registerDateTime: Date;
    memo?: string;
    type: AccountBookCategoryType;
    amount: number;
}
