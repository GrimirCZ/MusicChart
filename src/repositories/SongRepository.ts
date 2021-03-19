import { RightEnum, Room } from "../types/room.type";
import { DB_MODE } from "../config/variables";
import InMemoryRoomRepo from "./in-memory/room.repository";
import MongoRoomRepository from "./mongo/room.repository";
import { Song } from "../types/song.type";
import MongoSongRepository, { AddSongProps } from "./mongo/song.repository";
import InMemorySongRepository from "./in-memory/song.repository";


interface ISongRepository {

    add(props: AddSongProps): Promise<Song>

    getBySongId(songId: string): Promise<Song>

    remove(songId: string): Promise<void>
}

let SongRepository: ISongRepository

if(DB_MODE == "in-memory") {
    SongRepository = InMemorySongRepository
} else if(DB_MODE == "mongodb") {
    SongRepository = MongoSongRepository
}

export default SongRepository
