import { ClientConnectMessage } from "../types/message.type";
import ClientConnectionManager from "../managers/client-connection.manager";
import UserManager from "../managers/user.manager";
import { emitSongListChangeEvent } from "../emitters/emit-song-list-change.event";
import emitUserListChangeEvent, { broadcastUserListChangeEvent } from "../emitters/emit-user-list-change.event";
import { emitCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import WebSocket = require('ws');
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "../config/errors";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { NEW_USER_CONNECTED } from "../types/notification-data.type";
import RoomManager from "../managers/room.manager";
import SongManager from "../managers/song.manager";
import { doesNotHaveValue, hasValue } from "../util";

export const clientConnectHandler = async (ws: WebSocket, message: ClientConnectMessage) => {
    const user = await UserManager.getById(message.userId)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }

    const room = await RoomManager.getByUserId(user.id)

    if(room === undefined) {
        throw new Error(INTERNAL_SERVER_ERROR)
    }

    room.activeUsers++

    await RoomManager.save(room)

    if(hasValue(room.currentSongId)) {
        const song = room.songs.find(song => song.id === room.currentSongId)
        await emitCurrentSongChangeEvent(ws, song, room);
    }

    ClientConnectionManager.add(ws, user)

    await broadcastUserListChangeEvent(room);
    await emitSongListChangeEvent(ws, room);
    await broadcastNotification(room, {
        message: NEW_USER_CONNECTED,
        data: {
            newUserName: user.name
        }
    })
}

export default clientConnectHandler
