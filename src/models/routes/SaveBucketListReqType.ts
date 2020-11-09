import {Todo} from "../../entity/Todo";

export interface SaveBucketListReqType {
    title: string;
    description: string;
    completeDate: Date;
    thumbImageUrl?: string;
    imageUrl?: string;
    todoList: Todo[] | string;
}
