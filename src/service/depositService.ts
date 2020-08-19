import CommonError from "../error/CommonError";
import {getAccountByIdAndUserId} from "./accountService";
import {Deposit} from "../entity/Deposit";
import {Account} from "../entity/Account";

export const saveDeposit = async ({ accountId, userId, amount, depositDate }: {
    accountId: number;
    userId: number;
    amount: number;
    depositDate: Date;
}) => {
    const account = await getAccountByIdAndUserId(accountId, userId);

    if (!account) {
        throw new CommonError(`accountId:${accountId} is not found`, 400);
    }

    const deposit = new Deposit();
    deposit.accountId = accountId;
    deposit.amount = amount;
    deposit.depositDate = depositDate;
    deposit.prevTotalAmount = account.currentAmount;
    deposit.userId = userId;

    await Deposit.save(deposit);

    account.currentAmount = account.currentAmount + amount;
    await Account.save(account);

    return true;
};
