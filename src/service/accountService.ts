import { Account } from '../entity/Account';
import { SaveAccountReqType } from '../models/routes/SaveAccountReqType';
import CommonError from '../error/CommonError';
import { SavingType } from '../entity/SavingType';
import { Deposit } from '../entity/Deposit';
import { getConnection } from 'typeorm';
import { getDepositListByAccountId } from './depositService';

export const getAccountsByUserId = async (userId: number, limit: number = 100) => {
  return await Account.find({
    relations: ['savingType'],
    where: { userId },
    order: { id: 'DESC' },
    take: limit
  });
};

export const getNotExpirationAccounts = async (userId: number, limit: number = 3) => {
  return await Account.find({
    relations: ['savingType'],
    where: { userId, isExpiration: false },
    order: { id: 'DESC' },
    take: limit
  });
};

export const getSavedAmount = async (userId: number) => {
  const accounts = await getNotExpirationAccounts(userId, 100);

  return accounts.reduce((acc, account) => acc + account.amount, 0);
};

export const getLastUpdatedAccountDate = async (userId: number) => {
  const account = await Account.findOne({ order: { updatedAt: 'DESC' }, where: { userId } });

  // 없으면 캐시할 내용이 없는거니 현재일시 전달
  if (!account) {
    return new Date();
  }

  return account.updatedAt;
};

export const getAccountByIdAndUserId = async (id: number, userId: number) => {
  return await Account.findOne({ relations: ['savingType', 'deposits'], where: { id, userId } });
};

export const completeAccountExpiration = async (accountId: number, userId: number) => {
  const account = await getAccountByIdAndUserId(accountId, userId);

  if (!account) {
    throw new CommonError(`accountId:${accountId} is not found`, 400);
  }

  account.isExpiration = true;
  return await account.save();
};

export const getAccountById = async (id: number) => {
  return await Account.findOne({ where: { id } });
};

export const saveAccount = async (saveReq: SaveAccountReqType, userId: number) => {
  const savingType = await SavingType.findOne({ id: saveReq.savingTypeId });

  if (!savingType) {
    throw new CommonError('can`t find savingType', 400);
  }

  const account = new Account();
  account.title = saveReq.title;
  account.taxType = saveReq.taxType;
  account.regularTransferDate = saveReq.regularTransferDate;
  account.rate = saveReq.rate;
  account.startDate = saveReq.startDate;
  account.endDate = saveReq.endDate;
  account.amount = saveReq.amount;
  account.savingTypeId = saveReq.savingTypeId;
  account.userId = userId;
  account.currentAmount = 0;
  account.isExpiration = false; // 시작부터 만기일수 없음.

  return await account.save();
};

export const removeAccount = async (id: number, userId: number) => {
  let result = true;
  const account = await getAccountByIdAndUserId(id, userId);

  if (!account) {
    throw new CommonError(`accountId:${id} is not found`, 400);
  }

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const depositList = await getDepositListByAccountId(id);

    if (depositList.length >= 0) {
      await Deposit.remove(depositList);
    }

    await Account.remove(account);

    await queryRunner.commitTransaction();
  } catch (e) {
    result = false;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

  return result;
};
