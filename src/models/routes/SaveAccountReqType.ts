export interface SaveAccountReqType {
  title: string;
  taxType: string;
  regularTransferDate: number;
  rate: number;
  amount: number;
  savingTypeId: number;
  startDate: Date;
  endDate: Date;
}
