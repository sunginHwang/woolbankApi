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
    scheduledPaymentsType?: ScheduledPaymentType;
    scheduledPaymentsValue?: number;
}
