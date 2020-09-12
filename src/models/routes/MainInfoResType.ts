import {Account} from "../../entity/Account";
import {BucketListResType} from "./BucketListResType";

export interface MainInfoResType {
    amount: number;
    accounts: Account[],
    bucketList: BucketListResType[],
}
