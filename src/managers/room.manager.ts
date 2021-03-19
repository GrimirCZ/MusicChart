import { Room } from "../types/room.type";
import { USER_NOT_FOUND } from "../config/errors";
import RoomRepository, { AddRoomProps } from "../repositories/RoomRepository";

const add = async (props: AddRoomProps): Promise<Room> => {
    return RoomRepository.add(props)
}

const get = async (roomId: string) => {
    return RoomRepository.get(roomId)
}

const getByUserId = async (userId: string) => {
    return RoomRepository.getByUserId(userId)
}

const count = async () => await RoomRepository.count()

const activeRoomCount = async () => await RoomRepository.activeRoomCount()

const save = async (room: Room) => await RoomRepository.save(room)

const RoomManager = {
    add,
    get,
    getByUserId,
    count,
    save,
    activeRoomCount,
}

export default RoomManager
