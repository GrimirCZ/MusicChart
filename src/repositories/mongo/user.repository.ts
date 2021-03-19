import { Room } from "../../types/room.type";
import { randomBytes } from "crypto"
import { User } from "../../types/user.type";
import { RoomModel } from "../../db/mongo/room";
import { Song } from "../../types/song.type";

let users: User[] = []

type AddUserProps = {
    userName: string

    isAdmin: boolean

    canControl: boolean
    canAdd: boolean

    room: Room
}

const add = async ({userName, isAdmin, room, canControl, canAdd}: AddUserProps): Promise<User> => {
    const newUser: User = {
        id: randomBytes(26).toString("hex"),

        name: userName,
        isAdmin,

        canControl,
        canAdd,
    }

    const {roomId, users} = room
    console.log(users)

    await RoomModel.updateOne({roomId}, {users: [...users, newUser]})

    return newUser
}

const getById = async (userId: string): Promise<User> => {
    let res = await RoomModel.aggregate([
        {$match: {"users.id": userId}},
        {$unwind: "$users"},
        {$match: {"users.id": userId}},
        {$limit: 1},
        {$replaceRoot: {newRoot: "$users"}}
    ])

    if(res.length == 0)
        return null
    else
        return res[0]
};

const MongoUserRepository = {
    add,
    getById
}

export default MongoUserRepository
