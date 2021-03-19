import { Room } from "../../types/room.type";
import { randomBytes } from "crypto";
import { User } from "../../types/user.type";
import { getCurrentTimestamp } from "../../helpers/get-current-timestamp";
import { Song } from "../../types/song.type";
import { AddRoomProps } from "../RoomRepository";
import { USER_NOT_FOUND } from "../../config/errors";
import { IRoomModel, RoomModel } from "../../db/mongo/room";

const add = async ({roomName, musicControl, musicAdd}: AddRoomProps): Promise<Room> => {
    const newRoom = <Room>{
        roomId: randomBytes(26).toString("hex"),
        name: roomName,

        musicAdd,
        musicControl,

        adminId: undefined,
        adminName: undefined,

        currentSongId: undefined,
        lastChangeUserId: undefined,
        lastChangeUserName: undefined,
        users: [],
        songs: [],

        timeOfLastChangeStart: getCurrentTimestamp(),

        activeUsers: 0,

        currentSongState: "paused",
        currentSongTime: 0,
        since: 0
    }

    await RoomModel.create(newRoom)

    return newRoom
}

const get = async (roomId: string): Promise<Room> => {
    return RoomModel.findOne({roomId}).exec()
}


const getByUserId = async (userId: string): Promise<Room> =>
   await RoomModel.findOne({"users.id": userId}).exec();


const count = async (): Promise<number> => await RoomModel.count()

const activeRoomCount = async (): Promise<number> => {
    const {activeRoomCount} = <{ activeRoomCount: number }><unknown>await RoomModel.aggregate([
        {$match: {activeUsers: {$gt: 0}}},
        {$count: "activeRoomCount"}
    ])

    return activeRoomCount
}

const save = async (room: Room): Promise<void> => {
    await RoomModel.updateOne({roomId: room.roomId}, {$set: room})
}

const MongoRoomRepository = {
    add,
    get,
    getByUserId,
    count,
    save,
    activeRoomCount,
}

export default MongoRoomRepository
