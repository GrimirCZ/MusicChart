import WebSocket = require('ws');
import { User } from "../types/user.type";
import { ConnectionData } from "../types/connection-data.type";
import wss from "../config/ws.server";

let connection = new WeakMap<WebSocket, ConnectionData>()

const add = (ws: WebSocket, user: User) => {
    connection.set(ws, {
        user,
    })
}

const get = (ws: WebSocket) => {
    return connection.get(ws)
}

const ClientConnectionManager = {
    add,
    get
}

export default ClientConnectionManager
