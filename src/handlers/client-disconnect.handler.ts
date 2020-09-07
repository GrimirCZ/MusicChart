import { broadcastUserListChangeEvent } from "../emitters/emit-user-list-change.event";
import WebSocket = require('ws');
import ClientConnectionManager from "../managers/client-connection.manager";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { NEW_USER_CONNECTED, USER_DISCONNECTED } from "../types/notification-data.type";

export const clientDisconnectHandler = (ws: WebSocket) => {
    let user = ClientConnectionManager.get(ws)
    user.room.activeUsers--;
    ClientConnectionManager.remove(ws)

    broadcastUserListChangeEvent(user)

    broadcastNotification(user, {
        message: USER_DISCONNECTED,
        data: {
            disconnectedUserName: user.name
        }
    })
}
