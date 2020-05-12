import WebSocket = require('ws');
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { User } from "../types/user.type";
import { computeScore } from "../helpers/compute-score";


export const emitCurrentSongChangeEvent = (ws: WebSocket, user: User) => {
    const currentSong = user.room.currentSong

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
            currentScore: computeScore(currentSong.ratings),
            yourRating: currentSong.ratings.filter(rating => rating.user.id === user.id)[0].value ?? 0,

            hasPlayed: currentSong.hasPlayed
        } || null,

        state: user.room.currentSongState,
        time: user.room.currentSongTime
    }))
}

export const broadcastCurrentSongChangeEvent = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitCurrentSongChangeEvent(client.connection, client.user))
}

