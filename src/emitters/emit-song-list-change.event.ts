import WebSocket = require('ws');
import { User } from "../types/user.type";
import { Rating } from "../types/rating.type";
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";

const computeScore = (rating: Rating[]) => {
    return rating.reduce((prev, cur) => prev + cur.value, 0) / rating.length
}

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
            yourRating: ratings.filter(rating => rating.user.id === user.id)[0].value,

            dbgRatings: ratings.map(rating => [rating.value, rating.user.id, rating.user.name]),

            hasPlayed
        }))
    }))
}


export const broadcastSongListChange = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitSongListChangeEvent(client.connection, client.user))
}
