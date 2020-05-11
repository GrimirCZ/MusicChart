import { randomBytes } from "crypto"
import { User } from "../types/user.type";
import { Song } from "../types/song.type";
import { YOUTUBE_API_KEY } from "../config/variables"
import fetch from 'node-fetch';
import { INVALID_URL, UNKNOWN_SERVER_ERROR } from "../config/errors";


let songs: Song[] = []

type AddSongProps = {
    songUrl: string
    user: User
}

const getVideoData = async (videoId: string) => {

    const url = new URL('https://www.googleapis.com/youtube/v3/videos');

    url.searchParams.append("id", videoId)
    url.searchParams.append("key", YOUTUBE_API_KEY)
    url.searchParams.append("part", "snippet")

    const res = await fetch(url.toString()).then(res => res.json())

    if(res.items === undefined) {
        console.log(res)

        throw new Error(UNKNOWN_SERVER_ERROR);
    }

    let title = res.items[0].snippet.title;

    return {
        title
    }
}

const add = async ({songUrl, user}: AddSongProps): Promise<Song> => {
    const youtubeIdRegexRes = /^((http|https):\/\/)?(www\.)?youtube\.(com|cz)?\/watch\?v=(?<id>[^"&?\/\s]+)$/.exec(songUrl)

    if(!youtubeIdRegexRes.groups["id"])
        throw new Error(INVALID_URL);

    const youtubeId = youtubeIdRegexRes.groups["id"]

    const {title} = await getVideoData(youtubeId)

    const newSong: Song = {
        id: randomBytes(26).toString("hex"),
        youtubeId,

        name: title,

        user: user,
        room: user.room,

        ratings: user.room.users.map(user => ({
            user,
            value: 0
        })),

        hasPlayed: false
    }

    songs.push(newSong)

    return newSong
}

const get = (songId: string) => {
    return songs.filter(song => song.id === songId)[0]
}

const remove = (songId: string) => {
    songs = songs.filter(song => song.id !== songId)
}

const SongManager = {
    add,
    get,
    remove
}

export default SongManager
