import WebSocket = require('ws');
import { User } from "../types/user.type";

let connection = new WeakMap<WebSocket, User>()
let connectionCount = 0;

const add = (ws: WebSocket, user: User) => {
    connectionCount++;

    connection.set(ws, user,)
}

const get = (ws: WebSocket) => {
    return connection.get(ws)
}

const remove = (ws: WebSocket) => {
  connectionCount--;
}

const count = () => connectionCount

const ClientConnectionManager = {
    add,
    get,
    remove,
    count
}

export default ClientConnectionManager
