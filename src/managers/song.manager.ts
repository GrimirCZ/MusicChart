import { Song } from "../types/song.type";
import SongRepository from "../repositories/SongRepository";
import { AddSongProps } from "../repositories/mongo/song.repository";

const add = async (props: AddSongProps): Promise<Song> => {
    return SongRepository.add(props)
}

const get = (songId: string) => {
    return SongRepository.getBySongId(songId)
}

const remove = async (songId: string) => {
    await SongRepository.remove(songId)
}

const SongManager = {
    add,
    getBySongId: get,
    remove
}

export default SongManager
