import { Room } from "../types/room.type";
import wss from "../config/ws.server";
import ClientConnectionManager from "../managers/client-connection.manager";
import { User } from "../types/user.type";
import WebSocket = require("ws");

type ConnectionUser = {
    connection: WebSocket
    user: User
}

// TODO: get better way to get all connections of room more efficiently, also make it more readable
// TODO: try to figure better than O^2 complexity
export const getConnectionsOfRoom = (room: Room): ConnectionUser[] => {
    return Array.from(wss.clients)
        .reduce((arr, client) => {
            const user = room.users.filter((user: User) => user.id === ClientConnectionManager.get(client).id)[0] ?? null

            if(user) {
                return [...arr, {user, connection: client}]
            }

            return arr
        }, [])
}
