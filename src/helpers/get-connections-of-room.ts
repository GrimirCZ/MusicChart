import { Room } from "../types/room.type";
import wss from "../config/ws.server";
import ClientConnectionManager from "../managers/client-connection.manager";
import { User } from "../types/user.type";
import WebSocket = require("ws");

type ConnectionUser = {
    connection: WebSocket
    user: User
}

export const getConnectionsOfRoom = (room: Room): ConnectionUser[] => {
    return Array.from(wss.clients)
        .reduce((arr, client) => {
            const user = ClientConnectionManager.get(client).user

            if(user.room.id === room.id) {

                return [...arr, {user, connection: client}]
            }

            return arr
        }, [])
}
