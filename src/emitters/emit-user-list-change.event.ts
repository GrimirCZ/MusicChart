import WebSocket = require('ws');
import { User } from "../types/user.type";
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { Room } from "../types/room.type";

export const emitUserListChangeEvent = (ws: WebSocket, room: Room, activeUsers: User[]) => {
    ws.send(JSON.stringify({
        type: "user-data",
        activeUsers: activeUsers.map(({name}) => ({name}))
    }))
}

export const broadcastUserListChangeEvent = (room: Room) => {
    getConnectionsOfRoom(room)
        .then(clients =>
            clients.forEach(client =>
                emitUserListChangeEvent(
                    client.connection,
                    room,
                    clients.map(client => client.user)
                )
            )
        )
}

export default emitUserListChangeEvent
