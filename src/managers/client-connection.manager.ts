import WebSocket = require('ws');
import { User } from "../types/user.type";

let connections = new WeakMap<WebSocket, string>()
//@ts-ignore
let userConnections = new Map<string, WeakRef<WebSocket>>()
let connectionCount = 0;

const add = (ws: WebSocket, user: User) => {
    connectionCount++;

    connections.set(ws, user.id)
    //@ts-ignore
    userConnections.set(user.id, new WeakRef<WebSocket>(ws))
}

const getUserIdFromConnection = async (ws: WebSocket) => {
    return connections.get(ws)
}
const getConnectionFromUserId = async (userId: string): Promise<WebSocket | undefined> => {
    if(userConnections.has(userId))
        return userConnections.get(userId).deref()

    return undefined;
}

const remove = (ws: WebSocket) => {
    connectionCount--
}

const count = () => connectionCount

// cleanup dangling connections
setInterval(() => {
    const entries = userConnections.entries();

    //@ts-ignore
    for(const [key, value] of entries) {
        //@ts-ignore
        if(value.deref() === undefined) {
            userConnections.delete(key)
        }
    }
}, 1000 * 3600)

const ClientConnectionManager = {
    add,
    getUserIdFromConnection,
    getConnectionFromUserId,
    remove,
    count
}

export default ClientConnectionManager
