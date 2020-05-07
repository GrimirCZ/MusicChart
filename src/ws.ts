import {
    isValidMessage,
    Message,
    validateClientConnectMessage,
    validateSongAddMessage,
    validateSongChangeMessage,
    validateSongRateMessage,
    validateSongRemoveMessage
} from "./types/message.type";
import clientConnectHandler from "./handlers/client-connect.handler"
import songAddHandler from "./handlers/song-add.handler"
import songRemoveHandler from "./handlers/song-remove.handler"
import songRateHandler from "./handlers/song-rate.handler"
import songChangeHandler from "./handlers/song-change.handler"
import WebSocketServer from "./config/ws.server"


WebSocketServer.on("connection", (ws) => {
    ws.on("message", async (rawData: string) => {
        const data = JSON.parse(rawData)

        console.log(data)

        if(!isValidMessage(data)) {
            return
        }

        const message = <Message><unknown>data

        try {
            switch(message.type) {
                case "health-check":

                    ws.send(JSON.stringify({
                        type: "health-response",
                        status: "healthy"
                    }))
                    break
                case "client-connect":
                    clientConnectHandler(ws, validateClientConnectMessage(message));

                    break;

                case "song-add":

                    await songAddHandler(ws, validateSongAddMessage(message));
                    break;
                case "song-remove":

                    songRemoveHandler(ws, validateSongRemoveMessage(message));
                    break;

                case "song-rate":

                    songRateHandler(ws, validateSongRateMessage(message));
                    break;
                case "song-change":

                    songChangeHandler(ws, validateSongChangeMessage(message));
                    break;
            }
        } catch(e) {
            ws.send({
                type: "error",
                message: e.message
            })
        }
    })
});

export default WebSocketServer
