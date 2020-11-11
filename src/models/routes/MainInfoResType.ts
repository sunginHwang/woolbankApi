import {Account} from "../../entity/Account";
import {BucketListResType} from "./BucketListResType";

export interface MainInfoResType {
    totalSavedAmount: number;
    totalSavedAmountExceptCurrentMonth: number;
    accounts: Account[],
    bucketList: BucketListResType[],
}
