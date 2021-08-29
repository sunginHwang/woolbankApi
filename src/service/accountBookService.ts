import {endOfMonth, startOfMonth, startOfDay, endOfDay} from 'date-fns';
import {Between} from 'typeorm';
import * as _ from 'lodash';
import {AccountBook} from '../entity/AccountBook';
import {SaveAccountBookReqType} from '../models/routes/SaveAccountBookReqType';
import {getAccountBookCategoryByIdAndUserId} from './accountBookCategoryService';
import CommonError from '../error/CommonError';
import {AccountBookCategoryType} from '../models/AccountBookCategoryType';

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
        where: {userId, registerDateTime: Between(startOfMonth(dateTime), endOfMonth(dateTime))},
        order: {id: 'DESC'},
        take: limit
    });
};

export const getAccountBook = async ({userId, id}: { userId: number; id: number }) => {
    const accountBook = await AccountBook.findOne({
        relations: ['accountBookCategory'],
        where: {userId, id}
    });

    if (!accountBook) {
        throw new CommonError(`accountBookId:${id} is not found`, 404);
    }

    return accountBook;
};

export const saveAccountBook = async (reqType: SaveAccountBookReqType, userId: number) => {
    const {categoryId, amount, registerDateTime, memo = '', title, type} = reqType;
    const accountBookCategory = await getAccountBookCategoryByIdAndUserId(categoryId, userId);

    if (!accountBookCategory) {
        throw new CommonError(`categoryId:${reqType.categoryId} is not found`, 404);
    }

    const accountBook = new AccountBook();
    accountBook.title = title;
    accountBook.amount = amount;
    accountBook.memo = memo;
    accountBook.userId = userId;
    accountBook.registerDateTime = registerDateTime;
    accountBook.accountBookCategoryId = categoryId;
    accountBook.isRegularExpenditure = false;
    accountBook.type = type;

    const newAccountBook = await accountBook.save();
    newAccountBook.accountBookCategory = accountBookCategory;
    return convertClientAccountBook(newAccountBook, false);
};

export const updateAccountBook = async (reqType: SaveAccountBookReqType, id: number, userId: number) => {
    const {categoryId, amount, registerDateTime, memo = '', title, type} = reqType;
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
            return {
                amount,
                percentage,
                categoryId: key,
                categoryName: item[0].accountBookCategory.name,
                list: item.map(({title, amount, registerDateTime}) => {
                    return {title, amount, registerDateTime};
                }).sort((a, b) => b.amount - a.amount)
            };
        })
        .sort((a, b) => b.amount - a.amount);
};
