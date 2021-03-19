import * as dotenv from "dotenv";

dotenv.config({path: __dirname + '/../.env'});

import express = require("express");
import { DB_MODE, HTTP_PORT } from "./config/variables";
import { json, urlencoded } from "body-parser";
import RoomController from "./controllers/room.controller"
import cors = require("cors");
import { statHandler } from "./handlers/stats.handler";
import DB from "./config/db"
import runWS from "./ws"

let run = async () => {
    if(DB_MODE == "mongodb") {
        await DB.connect();
    }

    const server = express()

    server.use(cors({
        origin: "*",
        methods: "*"
    }))
    server.use(json())
    server.use(urlencoded())

    server.use('/timesync', ({body, query}, res) => {
        const id = "id" in query ? query.id : ("id" in body ? body.id : null)

        res.status(200).json({
            id,
            result: Date.now()
        })
    });
    server.use("/room", RoomController)
    server.get('/stats', statHandler)
    server.get("/", (req, res) => res.json({
        status: "healty",
        version: "0.0.1"
    }))

    server.listen(HTTP_PORT, () => {
        console.log(`Http server listening on port ${8000}`)
        console.log(`Websocket server listening on port ${8080}`)
    });

    runWS()
}

run()
