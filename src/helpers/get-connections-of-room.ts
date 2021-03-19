import { Room } from "../types/room.type";
import wss from "../config/ws.server";
import ClientConnectionManager from "../managers/client-connection.manager";
import { User } from "../types/user.type";
import WebSocket = require("ws");
import UserManager from "../managers/user.manager";

type ConnectionUser = {
    connection: WebSocket
    user: User
}

export const getConnectionsOfRoom = async (room: Room): Promise<ConnectionUser[]> => {
    const roomUserIds = room.users.map(user => user.id)
    let res: ConnectionUser[] = []

    for(const userId of roomUserIds) {
        const connection = await ClientConnectionManager.getConnectionFromUserId(userId);

        if(connection !== undefined) {
            const user = await UserManager.getById(userId)

            res.push({connection, user})
        }
    }

    return res;
}
