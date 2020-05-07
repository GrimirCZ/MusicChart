import { ClientConnectMessage } from "../types/message.type";
import ClientConnectionManager from "../managers/client-connection.manager";
import UserManager from "../managers/user.manager";
import { emitSongListChangeEvent } from "../emitters/emit-song-list-change.event";
import emitUserListChangeEvent from "../emitters/emit-user-list-change.event";
import { emitCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import WebSocket = require('ws');

export default (ws: WebSocket, message: ClientConnectMessage) => {
    const user = UserManager.get(message.userId)

    ClientConnectionManager.add(ws, user)

    emitSongListChangeEvent(ws, user);
    emitUserListChangeEvent(ws, user);
    emitCurrentSongChangeEvent(ws, user);
}
