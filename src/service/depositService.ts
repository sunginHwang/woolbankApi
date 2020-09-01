import CommonError from "../error/CommonError";
import {getAccountById} from "./accountService";
import {Deposit} from "../entity/Deposit";
import {getConnection} from "typeorm";


export const getDepositListByAccountId = async (accountId: number) => {
    return await Deposit.find({ where: { accountId } });
}

export const saveDeposit = async ({ accountId, userId, amount, depositDate }: {
    accountId: number;
    userId: number;
    amount: number;
    depositDate: Date;
}) => {
    let result = true;
    const account = await getAccountById(accountId);

    if (!account) {
        throw new CommonError(`accountId:${accountId} is not found`, 400);
    }

    if(account.isExpiration) {
        throw new CommonError('만기된 상품은 입금이 불가능 합니다.', 500);

    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const deposit = new Deposit();
        deposit.accountId = account.id;
        deposit.amount = amount;
        deposit.depositDate = depositDate;
        deposit.prevTotalAmount = account.currentAmount;
        deposit.userId = userId;

        await queryRunner.manager.save(deposit);

        account.currentAmount = account.currentAmount + amount;
        await queryRunner.manager.save(account);

        await queryRunner.commitTransaction();
    } catch (e) {
        result = false;
        await queryRunner.rollbackTransaction();
    }finally {
        await queryRunner.release();
    }

    return result;
};

