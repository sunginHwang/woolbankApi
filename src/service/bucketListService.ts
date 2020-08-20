import {BucketList} from "../entity/BucketList";

export const getBucketList = async (userId: number) => {
    return await BucketList.find({relations:['todoList'], where: {userId}});
};

