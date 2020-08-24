import {BucketList} from "../entity/BucketList";
import CommonError from "../error/CommonError";
import {SaveBucketListReqType} from "../models/routes/SaveBucketListReqType";
import {getConnection} from "typeorm";
import {getTodoListByBucketListId} from "./todoService";

export const getBucketList = async (userId: number) => {
    return await BucketList.find({relations:['todoList'], where: {userId}});
};

export const getBucketListLastUpdatedDate = async (userId: number) => {
    const bucketList = await BucketList.findOne({ order: {updatedAt: 'DESC'}, where: { userId } });

    // 없으면 캐시할 내용이 없는거니 현재일시 전달
    if(!bucketList) {
        return new Date();
    }

    return bucketList.updatedAt;
};

export const getBucketListById = async (id: number ,userId: number, useTodo: boolean = false) => {
    if (useTodo) {
        return await BucketList.findOne({relations:['todoList'], where: {id, userId}});
    } else{
        return await BucketList.findOne({ where: {id, userId}});
    }
};

export const isBucketListUpdate = async ({ id, userId, lastUpdatedAt }: {
    id: number;
    userId: number;
    lastUpdatedAt: Date;
}) => {
    const bucketList = await getBucketListById(id, userId);

    if (!bucketList) {
        throw new CommonError(`bucketListId:${id} is not found`, 400);
    }

    return bucketList.updatedAt.getTime() === new Date(lastUpdatedAt).getTime();
};

export const saveBucketList = async(saveReq: SaveBucketListReqType, userId: number) => {
    const bucketList = new BucketList();
    bucketList.title = saveReq.title;
    bucketList.description = saveReq.description;
    bucketList.completeDate = saveReq.completeDate;
    bucketList.userId = userId;
    bucketList.imageUrl = saveReq.imageUrl || '';
    bucketList.thumbImageUrl = saveReq.thumbImageUrl || '';

    return await bucketList.save();

}

export const updateBucketList = async({updateReq, id, userId} : {
    updateReq: SaveBucketListReqType;
    id: number;
    userId: number;
}) => {
    const bucketList = await getBucketListById(id, userId);

    if (!bucketList) {
        throw new CommonError(`bucketListId:${id} is not found`, 400);
    }

    bucketList.title = updateReq.title;
    bucketList.description = updateReq.description;
    bucketList.completeDate = updateReq.completeDate;
    bucketList.imageUrl = updateReq.imageUrl || '';
    bucketList.thumbImageUrl = updateReq.thumbImageUrl || '';

    return await bucketList.save();

}

export const removeBucketList = async (id: number, userId: number) => {
    let result = true;

    const bucketList = await getBucketListById(id, userId);

    if (!bucketList) {
        throw new CommonError(`bucketListId:${id} is not found`, 400);
    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const todoList = await getTodoListByBucketListId(id, userId);

        if (todoList.length > 0 ) {
            await queryRunner.manager.remove(todoList);
        }

        await queryRunner.manager.remove(bucketList);

        await queryRunner.commitTransaction();
    } catch (e) {
        result = false;
        await queryRunner.rollbackTransaction();
    }finally {
        await queryRunner.release();
    }

    return result;
}
