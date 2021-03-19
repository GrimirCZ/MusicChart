import { Room } from "../types/room.type";
import { randomBytes } from "crypto"
import { User } from "../types/user.type";
import UserRepository from "../repositories/UserRepository";
import { AddUserProps } from "../repositories/in-memory/user.repository";

const add = (props: AddUserProps): Promise<User> => {
    return UserRepository.add(props)
}

const get = (userId: string) => {
    return UserRepository.getById(userId)
}

const UserManager = {
    add,
    getById: get
}

export default UserManager
