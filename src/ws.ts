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
import { INVALID_JSON } from "./config/errors";
import { clientDisconnectHandler } from "./handlers/client-disconnect.handler";

const noop = () => {
}

const runWS = () => {
    WebSocketServer.on("connection", (ws) => {
        ws.on("pong", () => {})//console.log("got pong"))

        ws.on("message", async (rawData: string) => {
            const data = JSON.parse(rawData)

            if(!isValidMessage(data)) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: INVALID_JSON
                }))

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
                        await clientConnectHandler(ws, validateClientConnectMessage(message));

                        break;

                    case "song-add":

                        await songAddHandler(ws, validateSongAddMessage(message));
                        break;
                    case "song-remove":

                        await songRemoveHandler(ws, validateSongRemoveMessage(message));
                        break;

                    case "song-rate":

                        await songRateHandler(ws, validateSongRateMessage(message));
                        break;
                    case "song-change":

                        await songChangeHandler(ws, validateSongChangeMessage(message));
                        break;
                }
            } catch(e) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: e.message
                }))
            }
        })

        ws.on("close", () => {
            clientDisconnectHandler(ws)
        })
        ws.on("error", () => {
            clientDisconnectHandler(ws)
        })
    });

    setInterval(() => {
        WebSocketServer.clients.forEach((ws) => {
            ws.ping(noop);
        });
    }, 1000);
}

export default runWS
