import {BucketList} from "../entity/BucketList";

export const getBucketList = async (userId: number) => {
    return await BucketList.find({relations:['todoList'], where: {userId}});
};

export const getBucketListById = async (id: number ,userId: number) => {
    return await BucketList.findOne({relations:['todoList'], where: {id, userId}});
};

