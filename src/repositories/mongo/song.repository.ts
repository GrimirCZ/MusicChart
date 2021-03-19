import { randomBytes } from "crypto"
import { Song } from "../../types/song.type";
import { User } from "../../types/user.type";
import { Room } from "../../types/room.type";
import VideoService from "../../services/video.service";
import { RoomModel } from "../../db/mongo/room";

let songs: Song[] = []

export type AddSongProps = {
    songUrl: string
    user: User,
    room: Room,
}

const add = async ({songUrl, user, room}: AddSongProps): Promise<Song> => {
    const {roomId, songs} = room
    const {provider, id: youtubeId, title: name} = await VideoService.getVideoData(songUrl)

    const newSong: Song = {
        id: randomBytes(26).toString("hex"),

        youtubeId,
        provider,
        name,

        ratings: room.users.map(({id: userId, name: userName}) => ({
            userId,
            userName,
            value: 0
        })),

        authorId: user.id,
        authorName: user.name,

        hasPlayed: false
    }

    await RoomModel.updateOne({roomId}, {$set: {songs: [...songs, newSong]}})

    return newSong
}

const getBySongId = async (songId: string): Promise<Song> => {

    const res = await RoomModel.aggregate([
        {$match: {"songs.id": songId}},
        {$unwind: "$songs"},
        {$match: {"songs.id": songId}},
        {$limit: 1},
        {$replaceRoot: {newRoot: "$songs"}}
    ]);

    if(res.length === 0)
        return null
    else
        return res[0]
}

const remove = async (songId: string) => {
    const {roomId, songs} = await RoomModel.findOne({"songs.id": songId}).exec()

    await RoomModel.updateOne({roomId}, {songs: songs.filter(song => song.id !== songId)})
}

const MongoSongRepository = {
    add,
    getBySongId,
    remove
}

export default MongoSongRepository
