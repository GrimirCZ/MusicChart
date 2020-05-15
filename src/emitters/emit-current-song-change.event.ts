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
            ratings: currentSong.ratings.map(rating => ({
                userId: rating.user.id,
                userName: rating.user.name,
                rating: rating.value
            })),

            hasPlayed: currentSong.hasPlayed
        } || null,

        state: user.room.currentSongState,
        time: user.room.currentSongTime,
        since: user.room.since
    }))
}

export const broadcastCurrentSongChangeEvent = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitCurrentSongChangeEvent(client.connection, client.user))
}

