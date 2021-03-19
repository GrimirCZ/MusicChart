import { randomBytes } from "crypto"
import { Song } from "../../types/song.type";
import { User } from "../../types/user.type";
import { Room } from "../../types/room.type";
import VideoService from "../../services/video.service";

let songs: Song[] = []

type AddSongProps = {
    songUrl: string
    user: User,
    room: Room,
}

const add = async ({songUrl, user, room}: AddSongProps): Promise<Song> => {
    const {provider, id: youtubeId, title: name} = await VideoService.getVideoData(songUrl)

    const newSong: Song = {
        id: randomBytes(26).toString("hex"),

        youtubeId,
        provider,
        name,

        ratings: room.users.map(({id: userId, name: userName}) => ({
            userId,
            userName: name,
            value: 0
        })),

        authorId: user.id,
        authorName: user.name,

        hasPlayed: false
    }

    songs.push(newSong)

    return newSong
}

const getBySongId = async (songId: string): Promise<Song> => {
    return songs.filter(song => song.id === songId)[0]
}

const remove = async (songId: string) => {
    songs = songs.filter(song => song.id !== songId)
}

const InMemorySongRepository = {
    add,
    getBySongId,
    remove
}

export default InMemorySongRepository
