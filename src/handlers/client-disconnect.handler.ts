import { broadcastUserListChangeEvent } from "../emitters/emit-user-list-change.event";
import WebSocket = require('ws');
import ClientConnectionManager from "../managers/client-connection.manager";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { NEW_USER_CONNECTED, USER_DISCONNECTED } from "../types/notification-data.type";
import UserManager from "../managers/user.manager";
import RoomManager from "../managers/room.manager";

export const clientDisconnectHandler = async (ws: WebSocket) => {
    const user = await UserManager.getById(await ClientConnectionManager.getUserIdFromConnection(ws))
    const room = await RoomManager.getByUserId(user.id)

    room.activeUsers--

    await RoomManager.save(room)

    ClientConnectionManager.remove(ws)

    broadcastUserListChangeEvent(room)

    broadcastNotification(room, {
        message: USER_DISCONNECTED,
        data: {
            disconnectedUserName: user.name
        }
    })
}
