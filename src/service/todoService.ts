import { SaveTodoReq } from '../models/routes/SaveTodoReq';
import CommonError from '../error/CommonError';
import { Todo } from '../entity/Todo';
import {getBucketListById} from "./bucketListService";

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

  return await todo.save();
};

export const removeTodo = async (todoId: number, userId: number) => {
  const todo = await Todo.findOne({ where: { id: todoId } });

  if (!todo) {
      throw new CommonError(`todo is not found. todoId: ${todoId}`, 400);
  }

  return await Todo.remove(todo);
};

export const changeTodoComplete = async (todoId: number, isComplete: boolean) => {
    const todo = await Todo.findOne({ where: { id: todoId } });

    if (!todo) {
        throw new CommonError(`todo is not found. todoId: ${todoId}`, 400);
    }

    todo.isComplete = isComplete;

    return await Todo.save(todo);
};
