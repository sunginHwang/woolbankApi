import {User} from "../entity/User";

export const getUserById = async (id: number) => {
    return User.findOne({where: {id}});
}
