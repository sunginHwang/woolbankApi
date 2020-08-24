import {BucketList} from "../entity/BucketList";
import {Account} from "../entity/Account";
import CommonError from "../error/CommonError";
import {getAccountByIdAndUserId} from "./accountService";

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

export const getBucketListById = async (id: number ,userId: number) => {
    return await BucketList.findOne({relations:['todoList'], where: {id, userId}});
};

export const isBucketListUpdate = async ({ id, userId, lastUpdatedAt }: {
    id: number;
    userId: number;
    lastUpdatedAt: Date;
}) => {
    const bucketList = await getBucketListById(id, userId);

    if (!bucketList) {
        throw new CommonError(`accountId:${id} is not found`, 400);
    }

    return bucketList.updatedAt.getTime() === new Date(lastUpdatedAt).getTime();
};

