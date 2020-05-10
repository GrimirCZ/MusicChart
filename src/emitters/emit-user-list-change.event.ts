import WebSocket = require('ws');
import { User } from "../types/user.type";

const emitUserListChangeEvent = (ws: WebSocket, user: User) => {
    ws.send(JSON.stringify({
        type: "user-data",
        count: user.room.users.length
    }))
}

export default emitUserListChangeEvent
