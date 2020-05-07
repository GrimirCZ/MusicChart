import express = require("express");
import { json, urlencoded } from "body-parser";
import RoomController from "./controllers/room.controller"
import cors = require("cors");
import { HTTP_PORT } from "./config/variables";
import "./ws"

const server = express()

server.options("*", cors())

server.use(json())
server.use(urlencoded())

server.get("/", (req, res) => res.json({
    status: "healty",
    version: "0.0.1"
}))
server.use("/room", RoomController)

server.listen(HTTP_PORT, () => {
    console.log(`Http server listening on port ${8000}`)
    console.log(`Websocket server listening on port ${8080}`)
});
