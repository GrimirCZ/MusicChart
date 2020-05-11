import { ClientConnectMessage } from "../types/message.type";
import ClientConnectionManager from "../managers/client-connection.manager";
import UserManager from "../managers/user.manager";
import { emitSongListChangeEvent } from "../emitters/emit-song-list-change.event";
import emitUserListChangeEvent, { broadcastUserListChangeEvent } from "../emitters/emit-user-list-change.event";
import { emitCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import WebSocket = require('ws');
import { USER_NOT_FOUND } from "../config/errors";

export const clientConnectHandler = (ws: WebSocket, message: ClientConnectMessage) => {
    const user = UserManager.get(message.userId)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }

    ClientConnectionManager.add(ws, user)

    emitSongListChangeEvent(ws, user);
    emitCurrentSongChangeEvent(ws, user);
    broadcastUserListChangeEvent(user);
}

export default clientConnectHandler
