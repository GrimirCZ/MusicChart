import { SongAddMessage } from "../types/message.type";
import { broadCastCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import wss from "../config/ws.server";
import { Song } from "../types/song.type";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');

export default async (ws: WebSocket, message: SongAddMessage) => {
    const user = ClientConnectionManager.get(ws)

    if(!user.canAdd) {
        return
    }

    let newSong: Song;

    try {
        newSong = await SongManager.add({...message, user})
    } catch(e) {
        ws.send({
            type: "error",
            message: e.message
        })

        return
    }

    user.room.songs.push(newSong)

    broadCastCurrentSongChangeEvent(user)
}
