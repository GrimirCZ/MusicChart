import WebSocket = require('ws');
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { User } from "../types/user.type";


export const emitCurrentSongChangeEvent = (ws: WebSocket, user: User) => {
    const currentSong = user.room.currentSong
    console.log({
        type: "current-song-data",

        userName: user.room.lastChangeUser.name,
        currentSong: currentSong && {
            songId: currentSong.id,
            youtubeId: currentSong.youtubeId,
            songName: currentSong.name,

            userId: user.room.lastChangeUser.id,
            userName: user.room.lastChangeUser.name,

            //TODO: add better stat computation algorithm
            currentScore: currentSong.ratings.reduce((i, cur) => i + cur.value, 0) / currentSong.ratings.length,
            yourRating: currentSong.ratings.filter(rating => rating.user.id === user.id)[0] ?? 0,

            hasPlayed: currentSong.hasPlayed
        },
        since: user.room.timeOfLastChangeStart
    })
    ws.send(JSON.stringify({
        type: "current-song-data",

        userName: user.room.lastChangeUser.name,
        currentSong: currentSong && {
            songId: currentSong.id,
            youtubeId: currentSong.youtubeId,
            songName: currentSong.name,

            userId: user.room.lastChangeUser.id,
            userName: user.room.lastChangeUser.name,

            //TODO: add better stat computation algorithm
            currentScore: currentSong.ratings.reduce((i, cur) => i + cur.value, 0) / currentSong.ratings.length,
            yourRating: currentSong.ratings.filter(rating => rating.user.id === user.id)[0] ?? 0,

            hasPlayed: currentSong.hasPlayed
        },
        since: user.room.timeOfLastChangeStart
    }))
}

export const broadcastCurrentSongChangeEvent = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitCurrentSongChangeEvent(client.connection, client.user))
}

