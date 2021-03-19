import WebSocket = require('ws');
import { User } from "../types/user.type";
import { Rating } from "../types/rating.type";
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { computeScore } from "../helpers/compute-score";
import { Room } from "../types/room.type";


export const emitSongListChangeEvent = async (ws: WebSocket, room: Room) => {
    ws.send(JSON.stringify({
        type: "song-data",
        songs: room.songs.map( ({
                                                           id,
                                                           youtubeId,
                                                           name,
                                                           authorId,
                                                           authorName,
                                                           ratings,
                                                           hasPlayed
                                                       }) => {
            return ({
                songId: id,
                youtubeId,
                songName: name,
                userId: authorId,
                userName: authorName,
                currentScore: computeScore(ratings),

                ratings: ratings.map(rating => ({
                    userId: rating.userId,
                    userName: rating.userName,
                    rating: rating.value
                })),

                hasPlayed
            })
        })
    }))
}


export const broadcastSongListChange = (room: Room) => {
    getConnectionsOfRoom(room).then(clients => clients.forEach(({connection}) => emitSongListChangeEvent(connection, room)))
}
