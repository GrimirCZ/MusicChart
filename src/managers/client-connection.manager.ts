import WebSocket = require('ws');
import { User } from "../types/user.type";

let connection = new WeakMap<WebSocket, User>()

const add = (ws: WebSocket, user: User) => {
    connection.set(ws, user,)
}

const get = (ws: WebSocket) => {
    return connection.get(ws)
}

const ClientConnectionManager = {
    add,
    get
}

export default ClientConnectionManager
