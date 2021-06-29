import { endOfMonth, startOfMonth } from 'date-fns';
import { Between } from 'typeorm';
import * as _ from 'lodash';
import { AccountBook } from '../entity/AccountBook';
import { SaveAccountBookReqType } from '../models/routes/SaveAccountBookReqType';
import { getAccountBookCategoryByIdAndUserId } from './accountBookCategoryService';
import CommonError from '../error/CommonError';

export const getAccountBooksByUserIdAndDateTime = async ({
  userId,
  limit = 10000,
  dateTime
}: {
  userId: number;
  dateTime: Date;
  limit?: number;
}) => {
  return await AccountBook.find({
    relations: ['accountBookCategory'],
    where: { userId, registerDateTime: Between(startOfMonth(dateTime), endOfMonth(dateTime)) },
    order: { id: 'DESC' },
    take: limit
  });
};

export const saveAccountBook = async (reqType: SaveAccountBookReqType, userId: number) => {
  const { categoryId, amount, registerDateTime, memo = '', title, type } = reqType;
  const accountBookCategory = await getAccountBookCategoryByIdAndUserId(categoryId, userId);

  if (!accountBookCategory) {
    throw new CommonError(`categoryId:${reqType.categoryId} is not found`, 404);
  }

  const accountBook = new AccountBook();
  accountBook.title = title;
  accountBook.amount = amount;
  accountBook.memo = memo;
  accountBook.registerDateTime = registerDateTime;
  accountBook.userId = userId;
  accountBook.accountBookCategoryId = categoryId;
  accountBook.isRegularExpenditure = false;
  accountBook.type = type;

  const newAccountBook = await accountBook.save();
  newAccountBook.accountBookCategory = accountBookCategory;
  return convertClientAccountBook(newAccountBook);
};

export const convertClientAccountBook = (accountBook: AccountBook) => {
  const { id, title, type, isRegularExpenditure, amount, registerDateTime, accountBookCategory } = accountBook;
  return {
    id,
    title,
    type,
    isRegularExpenditure,
    amount,
    registerDateTime,
    categoryName: accountBookCategory.name
  };
};

export const getAccountBookMonthlyStatistics = async ({ userId, dateTime }: { userId: number; dateTime: Date }) => {
  const accountBooks = await getAccountBooksByUserIdAndDateTime({ userId, dateTime });
  const groupData = _.groupBy(accountBooks, 'accountBookCategoryId');
  return Object.entries(groupData).map(([key, item]) => {
    return {
      key,
      categoryName: item[0].accountBookCategory.name,
      amount: item.reduce((prev, acc) => prev + acc.amount, 0)
    };
  });
};
