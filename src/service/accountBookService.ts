import {endOfMonth, startOfMonth, startOfDay, endOfDay, getDate} from 'date-fns';
import {Between, getConnection} from 'typeorm';
import * as _ from 'lodash';
import {AccountBook} from '../entity/AccountBook';
import {SaveAccountBookReqType} from '../models/routes/SaveAccountBookReqType';
import {getAccountBookCategoryByIdAndUserId} from './accountBookCategoryService';
import CommonError from '../error/CommonError';
import {AccountBookCategoryType} from '../models/AccountBookCategoryType';
import { RegularExpenditure } from '../entity/RegularExpenditure';

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
        relations: ['accountBookCategory', 'accountBookCategory.accountBookCategoryImage'],
        where: {userId, registerDateTime: Between(startOfMonth(dateTime), endOfMonth(dateTime))},
        order: {id: 'DESC'},
        take: limit
    });
};

export const getAccountBook = async ({userId, id}: { userId: number; id: number }) => {
    const accountBook = await AccountBook.findOne({
        relations: ['accountBookCategory', 'accountBookCategory.accountBookCategoryImage'],
        where: {userId, id}
    });

    if (!accountBook) {
        throw new CommonError(`accountBookId:${id} is not found`, 404);
    }

    return accountBook;
};

export const saveAccountBook = async (reqType: SaveAccountBookReqType, userId: number) => {
    const {categoryId, amount, registerDateTime, memo = '', title, type, isDisabledBudget = false, scheduledPaymentsType, scheduledPaymentsValue} = reqType;
    const accountBookCategory = await getAccountBookCategoryByIdAndUserId(categoryId, userId);

    if (!accountBookCategory) {
        throw new CommonError(`categoryId:${reqType.categoryId} is not found`, 404);
    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
   try {
    if (!!scheduledPaymentsType && !!scheduledPaymentsValue) {
        // 정기지출 일자는 할부인경우 작성일 시점, 반복인 경우 반복일자를 기준으로 합니다.
        const regularDate = scheduledPaymentsType === 'repeat' ? scheduledPaymentsValue : getDate(new Date());
        const regularExpenditure = new RegularExpenditure();
        regularExpenditure.title = title;
        regularExpenditure.amount = amount;
        regularExpenditure.regularDate = regularDate;
        regularExpenditure.accountBookCategoryId = accountBookCategory.id;
        regularExpenditure.isAutoExpenditure = true;
        regularExpenditure.userId = userId;
        
        // 할부인 경우 할부일 추가
        if (scheduledPaymentsType === 'installment') {
            regularExpenditure.installmentMonths = scheduledPaymentsValue;
            regularExpenditure.paidInstallmentMonths = 1;
        }

        await regularExpenditure.save();
    }

    const accountBook = new AccountBook();
    accountBook.title = title;
    accountBook.amount = amount;
    accountBook.memo = memo;
    accountBook.userId = userId;
    accountBook.registerDateTime = registerDateTime;
    accountBook.isDisabledBudget = isDisabledBudget;
    accountBook.accountBookCategoryId = categoryId;
    accountBook.isRegularExpenditure = false;
    accountBook.type = type;

    const newAccountBook = await accountBook.save();
    newAccountBook.accountBookCategory = accountBookCategory;
    await queryRunner.commitTransaction();
    return convertClientAccountBook(newAccountBook, false);
   } catch (e) {
     await queryRunner.rollbackTransaction();
   } finally {
     await queryRunner.release();
   }
};

export const updateAccountBook = async (reqType: SaveAccountBookReqType, id: number, userId: number) => {
    const {categoryId, amount, registerDateTime, memo = '', title, type, isDisabledBudget = false } = reqType;
    const accountBookCategory = await getAccountBookCategoryByIdAndUserId(categoryId, userId);

    if (!accountBookCategory) {
        throw new CommonError(`categoryId:${reqType.categoryId} is not found`, 404);
    }

    const accountBook = await getAccountBook({userId, id});

    accountBook.title = title;
    accountBook.amount = amount;
    accountBook.memo = memo;
    accountBook.registerDateTime = registerDateTime;
    accountBook.accountBookCategoryId = categoryId;
    accountBook.type = type;
    accountBook.isDisabledBudget = isDisabledBudget;

    const newAccountBook = await accountBook.save();
    newAccountBook.accountBookCategory = accountBookCategory;
    return convertClientAccountBook(newAccountBook, false);
};

export const removeAccountBook = async (id: number, userId: number) => {
    const accountBook = await getAccountBook({userId, id});
    const removedAccountBook = await accountBook.remove();
    return removedAccountBook.id;
};

export const convertClientAccountBook = (accountBook: AccountBook, useMemo?: boolean) => {
    const {id, title, type, memo, isRegularExpenditure, amount, registerDateTime, accountBookCategory} = accountBook;
    const commonResult = {
        id,
        title,
        type,
        isRegularExpenditure,
        amount,
        registerDateTime,
        category: accountBookCategory
    };

    if (useMemo) {
        return Object.assign({}, commonResult, {memo});
    }

    return commonResult;
};

export const getAccountBookMonthlyStatistics = async ({
                                                          userId,
                                                          type = 'expenditure',
                                                          startDate,
                                                          endDate
                                                      }: {
    userId: number;
    type?: AccountBookCategoryType;
    startDate: Date;
    endDate: Date;
}) => {
    const accountBooks = await AccountBook.find({
        relations: ['accountBookCategory'],
        where: {
            userId,
            type,
            registerDateTime: Between(startOfDay(startDate), endOfDay(endDate))
        }
    });

    const totalAmount = accountBooks.reduce((acc, accountBook) => acc + accountBook.amount, 0);

    return _.chain(accountBooks)
        .groupBy('accountBookCategoryId')
        .map((item, key) => {
            const amount = item.reduce((prev, acc) => prev + acc.amount, 0);
            const percentage = Number(((amount / totalAmount) * 100).toFixed(0));
            const accountBookCategory = item[0].accountBookCategory;
            return {
                amount,
                percentage,
                categoryId: key,
                useStatistic: accountBookCategory.useStatistic,
                categoryName: accountBookCategory.name,
                list: item.map(({title, amount, registerDateTime}) => {
                    return {title, amount, registerDateTime};
                }).sort((a, b) => b.amount - a.amount)
            };
        })
        .sort((a, b) => b.amount - a.amount);
};
