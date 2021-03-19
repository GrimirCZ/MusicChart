import { RightEnum, Room } from "../types/room.type";
import { DB_MODE } from "../config/variables";
import InMemoryRoomRepo from "./in-memory/room.repository";
import MongoRoomRepository from "./mongo/room.repository";

export type AddRoomProps = {
    roomName: string

    musicControl: RightEnum
    musicAdd: RightEnum
}

interface IRoomRepository {

    add(props: AddRoomProps): Promise<Room>

    get(roomId: string): Promise<Room>

    getByUserId(userId: string): Promise<Room>

    count(): Promise<number>

    activeRoomCount(): Promise<number>

    save(room: Room): Promise<void>
}

let RoomRepository: IRoomRepository

if(DB_MODE == "in-memory") {
    RoomRepository = InMemoryRoomRepo;
} else if(DB_MODE == "mongodb") {
    RoomRepository = MongoRoomRepository;
}

export default RoomRepository
