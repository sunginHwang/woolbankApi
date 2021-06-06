import { AccountBook } from "../entity/AccountBook";
import {SaveAccountBookReqType} from "../models/routes/SaveAccountBookReqType";
import {getAccountBookByIdAndUserId} from "./accountBookCategoryService";
import CommonError from "../error/CommonError";

export const getAccountBooksByUserId = async (userId: number, limit: number = 100) => {
    return await AccountBook.find({
        relations: ['accountBookCategory'],
        where: { userId,  },
        order: { id: 'DESC' },
        take: limit
    });
};

export const saveAccountBook = async (reqType: SaveAccountBookReqType, userId: number) => {
    const {
      categoryId,
        amount,
        registerDateTime,
        memo = '',
        title,
        type,
    } = reqType;
    const accountBookCategory = await getAccountBookByIdAndUserId(categoryId, userId);

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

    return await accountBook.save();
}
