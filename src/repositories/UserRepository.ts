import { RightEnum, Room } from "../types/room.type";
import { DB_MODE } from "../config/variables";
import InMemoryRoomRepo from "./in-memory/room.repository";
import MongoRoomRepository from "./mongo/room.repository";
import { Song } from "../types/song.type";
import MongoSongRepository, { AddSongProps } from "./mongo/song.repository";
import InMemorySongRepository from "./in-memory/song.repository";
import { User } from "../types/user.type";
import InMemoryUserRepository, { AddUserProps } from "./in-memory/user.repository";
import MongoUserRepository from "./mongo/user.repository";


interface IUserRepository {

    add(props: AddUserProps): Promise<User>

    getById(userId: string): Promise<User>
}

let UserRepository: IUserRepository

if(DB_MODE == "in-memory") {
    UserRepository = InMemoryUserRepository
} else if(DB_MODE == "mongodb") {
    UserRepository = MongoUserRepository
}

export default UserRepository
