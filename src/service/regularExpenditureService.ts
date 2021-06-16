import { RegularExpenditure } from '../entity/RegularExpenditure';
import { getConnection } from 'typeorm';
import { SaveRegularExpenditureReqType } from '../models/routes/SaveRegularExpenditureReqType';
import CommonError from '../error/CommonError';
import { getNowDate, getRemainDate } from '../utils/date';
import { getAccountBookCategoryByIdAndUserId } from './accountBookCategoryService';
import {AccountBookCategory} from "../entity/AccountBookCategory";

export const getRegularExpenditureListByUserId = async (userId: number, limit: number = 100) => {
  return await RegularExpenditure.find({
    where: { userId },
    order: { id: 'DESC' },
    take: limit
  });
};

export const getRegularExpenditureListByRegularDate = async (registerDate: number) => {
  return await RegularExpenditure.find({
    where: { registerDate },
    order: { id: 'DESC' }
  });
};

export const createAccountbooks = async () => {
  const now = new Date();
  const regularExpenditureList = await getRegularExpenditureListByRegularDate(now.getDate());
}

export const getRegularExpenditureWithType = (
  category: AccountBookCategory,
  regularExpenditures: RegularExpenditure[]
) => {
  const { id, type, name } = category;
  const nowDate = getNowDate();

  const regularExpenditureList = regularExpenditures
    .filter((re) => re.accountBookCategoryId === id)
    .map((r) => Object.assign(r, { regularExpenditureDay: getRemainDate(r.regularDate) }));

  // 정기지출 당일 리스트
  const regularDateList = regularExpenditureList.filter((item) => item.regularDate === nowDate);
  // 지출일까지 날짜 남은 리스트 -> 날짜 순 정렬
  const notRegularDateList = regularExpenditureList
    .filter((item) => item.regularDate !== nowDate)
    .sort((a, b) => {
      // 지출일 아닌건 날짜 정렬
      return a.regularExpenditureDay.getTime() - b.regularExpenditureDay.getTime();
    });

  // 리스트 순서는 당일, 해당 달에 남은날, 다음달 이체일 순서
  const list = [...regularDateList, ...notRegularDateList];
  return Object.assign({ type, name }, { list });
};

export const saveRegularExpenditure = async (saveReq: SaveRegularExpenditureReqType, userId: number) => {
  const accountBookCategory = await getAccountBookCategoryByIdAndUserId(saveReq.accountBookCategoryId, userId);

  if (!accountBookCategory) {
    throw new CommonError('사용가능한 지출 타입이 아닙니다.', 404);
  }

  const regularExpenditure = new RegularExpenditure();
  regularExpenditure.title = saveReq.title;
  regularExpenditure.amount = saveReq.amount;
  regularExpenditure.regularDate = saveReq.regularDate;
  regularExpenditure.accountBookCategoryId = accountBookCategory.id;
  regularExpenditure.isAutoExpenditure = saveReq.isAutoExpenditure;
  regularExpenditure.userId = userId;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const savedRegularExpenditure = await regularExpenditure.save();
    savedRegularExpenditure.accountBookCategory = accountBookCategory;
    await queryRunner.commitTransaction();
    return savedRegularExpenditure;
  } catch (e) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

  return null;
};

export const removeRegularExpenditure = async (regularExpenditureId: number) => {
  const regularExpenditure = await RegularExpenditure.findOne({ where: { id: regularExpenditureId } });

  if (!regularExpenditure) {
    throw new CommonError(`regularExpenditure is not found. todoId: ${regularExpenditureId}`, 400);
  }

  return await RegularExpenditure.remove(regularExpenditure);
};
