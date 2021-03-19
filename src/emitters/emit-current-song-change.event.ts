import WebSocket = require('ws');
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { User } from "../types/user.type";
import { computeScore } from "../helpers/compute-score";
import RoomManager from "../managers/room.manager";
import { Room } from "../types/room.type";
import { Song } from "../types/song.type";


export const emitCurrentSongChangeEvent = async (ws: WebSocket, currentSong: Song, room: Room) => {

    ws.send(JSON.stringify({
        type: "current-song-data",

        userName: room.lastChangeUserName,
        currentSong: currentSong && {
            songId: currentSong.id,
            youtubeId: currentSong.youtubeId,
            songName: currentSong.name,

            userId: room.lastChangeUserId,
            userName: room.lastChangeUserName,

            //TODO: add better stat computation algorithm
            currentScore: computeScore(currentSong.ratings),
            ratings: currentSong.ratings.map(rating => ({
                userId: rating.userId,
                userName: rating.userName,
                rating: rating.value
            })),

            hasPlayed: currentSong.hasPlayed
        } || null,

        state: room.currentSongState,
        time: room.currentSongTime,
        since: room.since
    }))
}

export const broadcastCurrentSongChangeEvent = (room: Room, song: Song) => {
    getConnectionsOfRoom(room).then(clients => clients.forEach(client => emitCurrentSongChangeEvent(client.connection,song, room)))
}

