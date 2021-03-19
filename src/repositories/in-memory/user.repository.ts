import { Room } from "../../types/room.type";
import { randomBytes } from "crypto"
import { User } from "../../types/user.type";

let users: User[] = []

export type AddUserProps = {
    userName: string

    isAdmin: boolean

    canControl: boolean
    canAdd: boolean

    room: Room
}

const add = async ({userName, isAdmin, room, canControl, canAdd}: AddUserProps): Promise<User> => {
    const newUser = {
        id: randomBytes(26).toString("hex"),

        name: userName,
        isAdmin,

        canControl,
        canAdd,

        room
    }

    users.push(newUser)

    return newUser
}

const getById = async (userId: string): Promise<User> => {
    return users.filter(user => user.id === userId)[0]
}

const InMemoryUserRepository = {
    add,
    getById
}

export default InMemoryUserRepository
