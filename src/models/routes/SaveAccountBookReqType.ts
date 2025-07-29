import {AccountBookCategoryType} from "../AccountBookCategoryType";

export type ScheduledPaymentType = 'repeat' | 'installment';

export interface SaveAccountBookReqType {
    title: string;
    categoryId: number;
    registerDateTime: Date;
    memo?: string;
    type: AccountBookCategoryType;
    amount: number;
    isDisabledBudget?:boolean;
    scheduledPaymentType?: ScheduledPaymentType;
    scheduledPaymentDay?: number;
    installmentMonth?: number;
}
