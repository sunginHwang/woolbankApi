import { BucketList } from '../entity/BucketList';
import CommonError from '../error/CommonError';
import { SaveBucketListReqType } from '../models/routes/SaveBucketListReqType';
import { getConnection } from 'typeorm';
import { getTodoListByBucketListId } from './todoService';
import { Todo } from '../entity/Todo';
import {BucketListResType} from "../models/routes/BucketListResType";

export const getBucketListByUserId = async (userId: number, limit: number = 100) => {

  const bucketList = await BucketList.find({
    relations: ['todoList'],
    where: { userId },
    order: { id: 'DESC' },
    take: limit
  });

  return bucketList.map<BucketListResType>((bucket) => ({
    id: bucket.id,
    title: bucket.title,
    completeDate: bucket.completeDate,
    todoCount: bucket.todoList.length,
    completeTodoCount: bucket.todoList.filter((todo) => todo.isComplete).length,
    thumbImageUrl: bucket.thumbImageUrl,
    updatedAt: bucket.updatedAt
  }));
};

export const getBucketListLastUpdatedDate = async (userId: number) => {
  const bucketList = await BucketList.findOne({ order: { updatedAt: 'DESC' }, where: { userId } });

  // 없으면 캐시할 내용이 없는거니 현재일시 전달
  if (!bucketList) {
    return new Date();
  }

  return bucketList.updatedAt;
};

export const getBucketListById = async (id: number, userId: number, useTodo: boolean = false) => {
  if (useTodo) {
    return await BucketList.findOne({ relations: ['todoList'], where: { id, userId } });
  } else {
    return await BucketList.findOne({ where: { id, userId } });
  }
};

export const getLastUpdatedBucketListDate = async (id: number, userId: number) => {
  const bucketList = await getBucketListById(id, userId);

  if (!bucketList) {
    throw new CommonError(`bucketListId:${id} is not found`, 404);
  }

  return bucketList.updatedAt;
};

export const saveBucketList = async (saveReq: SaveBucketListReqType, userId: number) => {
  const bucketList = new BucketList();
  bucketList.title = saveReq.title;
  bucketList.description = saveReq.description;
  bucketList.completeDate = saveReq.completeDate;
  bucketList.userId = userId;
  bucketList.imageUrl = saveReq.imageUrl || '';
  bucketList.thumbImageUrl = saveReq.thumbImageUrl || '';

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const savedBucketList = await BucketList.save(bucketList);

    if (typeof saveReq.todoList !== 'string') {
      const todoList: Todo[] = saveReq.todoList.map((todo) => {
        delete todo.id;
        todo.userId = userId;
        todo.bucketListId = savedBucketList.id;
        return todo;
      });

      // todo 존재 시 같이 추가
      if (todoList.length > 0) {
        await Todo.save(todoList);
      }
    }


    await queryRunner.commitTransaction();
    return savedBucketList;
  } catch (e) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

  return null;
};

export const updateBucketList = async ({
  updateReq,
  id,
  userId
}: {
  updateReq: SaveBucketListReqType;
  id: number;
  userId: number;
}) => {
  const bucketList = await getBucketListById(id, userId);

  if (!bucketList) {
    throw new CommonError(`bucketListId:${id} is not found`, 404);
  }

  bucketList.title = updateReq.title;
  bucketList.description = updateReq.description;
  bucketList.completeDate = updateReq.completeDate;
  bucketList.imageUrl = updateReq.imageUrl || '';
  bucketList.thumbImageUrl = updateReq.thumbImageUrl || '';

  return await bucketList.save();
};

export const removeBucketList = async (id: number, userId: number) => {
  let result = true;

  const bucketList = await getBucketListById(id, userId);

  if (!bucketList) {
    throw new CommonError(`bucketListId:${id} is not found`, 404);
  }

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const todoList = await getTodoListByBucketListId(id, userId);

    if (todoList.length > 0) {
      await queryRunner.manager.remove(todoList);
    }

    await queryRunner.manager.remove(bucketList);

    await queryRunner.commitTransaction();
  } catch (e) {
    result = false;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

  return result;
};
