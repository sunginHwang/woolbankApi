import Router from '@koa/router';
import {resError, resOK} from "../../utils/common";
import {changeTodoComplete, removeTodo, saveTodo} from "../../service/todoService";
import {SaveTodoReq} from "../../models/routes/SaveTodoReq";
import isAuthenticated from "../../middleware/isAuthenticated";
import isRealUserAuthenticated from '../../middleware/isRealUserAuthenticated';

const router = new Router();

router.post('/', isAuthenticated, isRealUserAuthenticated, async (ctx) => {
    const todoReq: SaveTodoReq = ctx.request.body as SaveTodoReq;

    if (!todoReq.title || !Number.isInteger(Number(todoReq.bucketListId))) {
        return resError({ctx, errorCode: 400, message: 'body validation fail' });
    }

    const savedTodo = await saveTodo(todoReq,ctx.userId);
    return resOK(ctx, {
        todoId: savedTodo.id
    });
});

router.put('/:todoId', isAuthenticated, isRealUserAuthenticated, async (ctx) => {
    const { todoId } = ctx.params;
    const { isComplete } = ctx.request.body  as any;

    if (!Number.isInteger(Number(todoId))) {
        return resError({ctx, errorCode: 400, message:  `todoId: ${todoId} is not allow request param`});
    }

    const removeResult = await changeTodoComplete(Number(todoId), isComplete, ctx.userId);
    return resOK(ctx, removeResult);
});

router.delete('/:todoId', isAuthenticated, isRealUserAuthenticated, async (ctx) => {
    const { todoId } = ctx.params;

    if (!Number.isInteger(Number(todoId))) {
        return resError({ctx, errorCode: 400, message:  `todoId: ${todoId} is not allow request param`});
    }
    const removeResult = await removeTodo(Number(todoId), ctx.userId);
    return resOK(ctx, removeResult);
});



export default router;
