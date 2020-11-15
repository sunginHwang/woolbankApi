import { SaveTodoReq } from '../models/routes/SaveTodoReq';
import CommonError from '../error/CommonError';
import { Todo } from '../entity/Todo';
import { getBucketListById, updateBucketListByUpdatedAt } from './bucketListService';
import { getConnection } from 'typeorm';

export const getTodoListByBucketListId = async (bucketListId: number, userId: number) => {
  return await Todo.find({ where: { bucketListId, userId } });
};

export const saveTodo = async (saveReq: SaveTodoReq, userId: number) => {
  const bucketList = await getBucketListById(saveReq.bucketListId, userId);

  if (!bucketList) {
    throw new CommonError(`bucketList is not found. bucketListId: ${saveReq.bucketListId}`, 400);
  }

  const todo = new Todo();
  todo.title = saveReq.title;
  todo.isComplete = saveReq.isComplete;
  todo.bucketListId = saveReq.bucketListId;
  todo.userId = userId;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const savedTodo = await todo.save();
    await updateBucketListByUpdatedAt(saveReq.bucketListId, userId);
    await queryRunner.commitTransaction();
    return savedTodo;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
};

export const removeTodo = async (todoId: number, userId: number) => {
  const todo = await Todo.findOne({ where: { id: todoId } });

  if (!todo) {
    throw new CommonError(`todo is not found. todoId: ${todoId}`, 400);
  }

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const removedTodo = await Todo.remove(todo);

    await updateBucketListByUpdatedAt(todo.bucketListId, userId);
    await queryRunner.commitTransaction();

    return removedTodo;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
};

export const changeTodoComplete = async (todoId: number, isComplete: boolean, userId: number) => {
  const todo = await Todo.findOne({ where: { id: todoId } });

  if (!todo) {
    throw new CommonError(`todo is not found. todoId: ${todoId}`, 400);
  }

  todo.isComplete = isComplete;

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const updatedTodo = await Todo.save(todo);

    await updateBucketListByUpdatedAt(updatedTodo.bucketListId, userId);
    await queryRunner.commitTransaction();

    return updatedTodo;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
};
