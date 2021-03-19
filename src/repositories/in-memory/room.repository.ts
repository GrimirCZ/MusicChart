import { Room } from "../../types/room.type";
import { randomBytes } from "crypto";
import { User } from "../../types/user.type";
import { getCurrentTimestamp } from "../../helpers/get-current-timestamp";
import { Song } from "../../types/song.type";
import { AddRoomProps } from "../RoomRepository";
import { USER_NOT_FOUND } from "../../config/errors";

let rooms: Room[] = []

const add = async ({roomName, musicControl, musicAdd}: AddRoomProps): Promise<Room> => {
    const newRoom = <Room>{
        roomId: randomBytes(26).toString("hex"),
        name: roomName,

        musicAdd,
        musicControl,

        admin: <null>null,
        users: <User[]>[],

        songs: <Song[]>[],

        timeOfLastChangeStart: getCurrentTimestamp(),

        activeUsers: 0,

        currentSongState: "paused",
        currentSongTime: 0,
        since: 0
    }

    rooms.push(newRoom)

    return newRoom
}

const get = async (roomId: string): Promise<Room> => {
    return rooms.filter(room => room.roomId === roomId)[0]
}


const getByUserId = async (userId: string): Promise<Room> => {
    const eligibleRooms = rooms.filter(room => room.users.some(user => user.id === userId))

    if(eligibleRooms.length == 0) {
        throw new Error(USER_NOT_FOUND)
    } else {
        return eligibleRooms[0];
    }
}

const count = async (): Promise<number> => rooms.length

const activeRoomCount = async (): Promise<number> => rooms.filter(room => room.activeUsers > 0).length

const save = async (room: Room): Promise<void> => {
}

const InMemoryRoomRepository = {
    add,
    get,
    getByUserId,
    count,
    save,
    activeRoomCount,
}

export default InMemoryRoomRepository
