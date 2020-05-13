import WebSocket = require('ws');
import { User } from "../types/user.type";
import { Rating } from "../types/rating.type";
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { computeScore } from "../helpers/compute-score";


export const emitSongListChangeEvent = (ws: WebSocket, user: User) => {
    ws.send(JSON.stringify({
        type: "song-data",
        songs: user.room.songs.map(({
                                        id,
                                        youtubeId,
                                        name,
                                        user,
                                        ratings,
                                        hasPlayed
                                    }) => ({
            songId: id,
            youtubeId,
            songName: name,
            userId: user.id,
            userName: user.name,
            currentScore: computeScore(ratings),

            ratings: ratings.map(rating => ({
                userId: rating.user.id,
                userName: rating.user.name,
                rating: rating.value
            })),

            hasPlayed
        }))
    }))
}


export const broadcastSongListChange = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitSongListChangeEvent(client.connection, client.user))
}
