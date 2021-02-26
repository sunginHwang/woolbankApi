import {RegularExpenditure} from "../entity/RegularExpenditure";
import {getConnection} from "typeorm";
import {SaveRegularExpenditureReqType} from "../models/routes/SaveRegularExpenditureReqType";
import CommonError from "../error/CommonError";


export const getRegularExpenditureListByUserId = async (userId: number, limit: number = 100) => {
    return await RegularExpenditure.find({
        relations: ['expenditureType'],
        where: { userId },
        order: { id: 'DESC' },
        take: limit
    });
}

export const saveRegularExpenditure = async (saveReq: SaveRegularExpenditureReqType, userId: number) => {
    const regularExpenditure = new RegularExpenditure();
    regularExpenditure.title = saveReq.title;
    regularExpenditure.amount = saveReq.amount;
    regularExpenditure.regularDate = saveReq.regularDate;
    regularExpenditure.expenditureTypeId = saveReq.expenditureTypeId;
    regularExpenditure.isAutoExpenditure = saveReq.isAutoExpenditure;
    regularExpenditure.userId = userId;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('34');
    try {
        const savedRegularExpenditure = await regularExpenditure.save();
        console.log('56');
        await queryRunner.commitTransaction();
        return savedRegularExpenditure;
    } catch (e) {
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }

    return null;
}


export const removeRegularExpenditure = async (regularExpenditureId: number) => {
    const regularExpenditure = await RegularExpenditure.findOne({ where: { id: regularExpenditureId } });

    if (!regularExpenditure) {
        throw new CommonError(`regularExpenditure is not found. todoId: ${regularExpenditureId}`, 400);
    }

    return await RegularExpenditure.remove(regularExpenditure);
};
