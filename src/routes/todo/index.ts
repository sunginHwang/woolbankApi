import Router from '@koa/router';
import {resError, resOK} from "../../utils/common";
import {changeTodoComplete, removeTodo, saveTodo} from "../../service/todoService";
import {SaveTodoReq} from "../../models/routes/SaveTodoReq";

const router = new Router();
const userId = 1;

router.post('/', async (ctx) => {
    const todoReq: SaveTodoReq = ctx.request.body;

    if (!todoReq.title || !Number.isInteger(Number(todoReq.bucketListId))) {
        return resError({ctx, errorCode: 400, message: 'body validation fail' });
    }

    const savedTodo = await saveTodo(todoReq,userId);
    return resOK(ctx, {
        todoId: savedTodo.id
    });
});

router.put('/:todoId', async (ctx) => {
    const { todoId } = ctx.params;
    const { isComplete } = ctx.request.body;
    console.log(todoId);
    console.log(isComplete);
    if (!Number.isInteger(Number(todoId))) {
        return resError({ctx, errorCode: 400, message:  `todoId: ${todoId} is not allow request param`});
    }
    const removeResult = await changeTodoComplete(Number(todoId), isComplete);
    return resOK(ctx, removeResult);
});

router.delete('/:todoId', async (ctx) => {
    const { todoId } = ctx.params;

    if (!Number.isInteger(Number(todoId))) {
        return resError({ctx, errorCode: 400, message:  `todoId: ${todoId} is not allow request param`});
    }
    const removeResult = await removeTodo(Number(todoId), userId);
    return resOK(ctx, removeResult);
});



export default router;
