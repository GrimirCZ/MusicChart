import WebSocket = require('ws');
import { User } from "../types/user.type";

const emitUserListChangeEvent = (ws: WebSocket, user: User) => {
    ws.send({
        type: "user-data",
        songs: user.room.users.length
    })
}

export default emitUserListChangeEvent
