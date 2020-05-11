import WebSocket = require('ws');
import { User } from "../types/user.type";
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";

export const emitUserListChangeEvent = (ws: WebSocket, user: User) => {
    ws.send(JSON.stringify({
        type: "user-data",
        songs: user.room.users.length
    }))
}

export const broadcastUserListChangeEvent = (user: User) => {
    getConnectionsOfRoom(user.room)
        .forEach(client => emitUserListChangeEvent(client.connection, client.user))
}

export default emitUserListChangeEvent
