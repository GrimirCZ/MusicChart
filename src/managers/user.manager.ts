import { Room } from "../types/room.type";
import { randomBytes } from "crypto"
import { User } from "../types/user.type";

let users: User[] = []

type AddUserProps = {
    userName: string

    isAdmin: boolean

    canControl: boolean
    canAdd: boolean

    room: Room
}

const add = ({userName, isAdmin, room, canControl, canAdd}: AddUserProps): User => {
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

const get = (userId: string) => {
    return users.filter(user => user.id === userId)[0]
}

const UserManager = {
    add,
    get
}

export default UserManager
