import WebSocket = require('ws');
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { User } from "../types/user.type";


export const emitCurrentSongChangeEvent = (ws: WebSocket, user: User) => {
    ws.send(JSON.stringify({
        type: "current-song-data",

        userName: user.room.lastChangeUser.name,
        currentSong: user.room.currentSong || null,
        since: user.room.timeOfLastChangeStart
    }))
}

export const broadCastCurrentSongChangeEvent = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitCurrentSongChangeEvent(client.connection, client.user))
}

