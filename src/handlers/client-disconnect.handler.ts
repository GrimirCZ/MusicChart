import { broadcastUserListChangeEvent } from "../emitters/emit-user-list-change.event";
import WebSocket = require('ws');
import ClientConnectionManager from "../managers/client-connection.manager";

export const clientDisconnectHandler = (ws: WebSocket) => {
    broadcastUserListChangeEvent(ClientConnectionManager.get(ws))
}
