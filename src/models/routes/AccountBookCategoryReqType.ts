import { AccountBookCategoryType } from "../AccountBookCategoryType";

export interface AccountBookCategoryReqType {
  name: string;
  type: AccountBookCategoryType;
  imageId: number;
  useStatistic: boolean;
}
