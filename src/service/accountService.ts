import { Account } from '../entity/Account';
import { SaveAccountReqType } from '../models/routes/SaveAccountReqType';
import CommonError from '../error/CommonError';
import { SavingType } from '../entity/SavingType';
import { resError } from '../utils/common';
import { Deposit } from '../entity/Deposit';

export const getAccountsByUserId = async (userId: number, limit: number = 100) => {
  return await Account.find({
    relations: ['savingType'],
    where: { userId },
    order: {id: "DESC"},
    take: limit
  });
};

export const getLastUpdatedAccountDate = async (userId: number) => {
  const account = await Account.findOne({ relations: ['savingType'], order: {updatedAt: 'DESC'}, where: { userId } });

  // 없으면 캐시할 내용이 없는거니 현재일시 전달
  if(!account) {
    return new Date();
  }

  return account.updatedAt;
};

export const getAccountByIdAndUserId = async (id: number, userId: number) => {
  return await Account.findOne({ relations: ['savingType'], where: { id, userId } });
};

export const saveAccount = async (saveReq: SaveAccountReqType, userId: number) => {
  const savingType = await SavingType.findOne({ id: saveReq.saveTypeId });

  if (!savingType) {
    throw new CommonError('can`t find savingType', 400);
  }

  const account = new Account();
  account.title = saveReq.title;
  account.taxType = saveReq.taxType;
  account.regularTransferDate = saveReq.regularTransferDate;
  account.rate = saveReq.rate;
  account.amount = saveReq.amount;
  account.saveTypeId = saveReq.saveTypeId;
  account.userId = userId;
  account.currentAmount = 0;

  return await account.save();
};

export const removeAccount = async (id: number, userId: number) => {
    const account = await getAccountByIdAndUserId(id, userId);

    if (!account) {
        throw new CommonError(`accountId:${id} is not found`, 400);
    }

  const deposits = await Deposit.find({ where: { accountId: id } });

  if(deposits.length >= 0 ){
      await Deposit.remove(deposits);
  }

  return await Account.remove(account);

};

type isAccountUpdateType = {
  id: number;
  userId: number;
  lastUpdatedAt: Date;
};

export const isAccountUpdate = async ({ id, userId, lastUpdatedAt }: isAccountUpdateType) => {
  const account = await getAccountByIdAndUserId(id, userId);

  if (!account) {
    throw new CommonError(`accountId:${id} is not found`, 400);
  }

  const accountLastUpdatedAt = account.updatedAt;
  return accountLastUpdatedAt.getTime() === new Date(lastUpdatedAt).getTime();
};
