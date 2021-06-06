import { AccountBookCategory } from '../entity/AccountBookCategory';
import CommonError from '../error/CommonError';
import { AccountBookCategoryReqType } from '../models/routes/AccountBookCategoryReqType';

export const getAccountBookCategoriesByUserId = async (userId: number, limit: number = 100) => {
  return await AccountBookCategory.find({
    where: { userId, delYn: false },
    order: { id: 'DESC' },
    take: limit
  });
};

export const getAccountBookByIdAndUserId = async (id: number, userId: number) => {
    return await AccountBookCategory.findOne({ where: { id, userId } });
};

export const saveAccountBookCategory = async (saveReq: AccountBookCategoryReqType, userId: number) => {
  if (saveReq.type !== 'income' && saveReq.type !== 'expenditure') {
    throw new CommonError('사용가능한 타입이 아닙니다.', 400);
  }

  const accountBookCategory = new AccountBookCategory();
  accountBookCategory.delYn = false;
  accountBookCategory.userId = userId;
  accountBookCategory.name = saveReq.name;
  accountBookCategory.type = saveReq.type;

  return await accountBookCategory.save();
};

export const removeAccountBookCategory = async (id: number, userId: number) => {
  const accountBookCategory = await getAccountBookByIdAndUserId(id, userId);

  if (!accountBookCategory) {
    throw new CommonError(`accountBookCategory is not found. id: ${id}`, 400);
  }

  accountBookCategory.delYn = true;

  return await accountBookCategory.save();
};
