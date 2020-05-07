import express = require("express");
import { json, urlencoded } from "body-parser";
import RoomController from "./controllers/room.controller"
import "./ws"
import { HTTP_PORT } from "./config/variables";

const server = express()

server.use(json())
server.use(urlencoded())

server.use("/room", RoomController)

server.listen(HTTP_PORT, () => {
    console.log(`Http server listening on port ${8000}`)
    console.log(`Websocket server listening on port ${8080}`)
});