import WebSocket = require('ws');
import { User } from "../types/user.type";
import { getConnectionsOfRoom } from "../helpers/get-connections-of-room";
import { NotificationData } from "../types/notification-data.type";
import { Room } from "../types/room.type";

export const emitNotification = (ws: WebSocket, user: User, notification: NotificationData) => {
    ws.send(JSON.stringify({
        type: "notification",
        message: notification.message,
        data: notification.data
    }))
}

export const broadcastNotification = (room: Room, notification: NotificationData) => {
    getConnectionsOfRoom(room).then(clients => clients.forEach(client => emitNotification(client.connection, client.user, notification)))
}
