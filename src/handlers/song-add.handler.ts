import { SongAddMessage } from "../types/message.type";
import { broadCastCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import wss from "../config/ws.server";
import { Song } from "../types/song.type";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');
import { INSUFFICIENT_PERMISSIONS, USER_NOT_FOUND } from "../config/errors";

export default async (ws: WebSocket, message: SongAddMessage) => {
    const user = ClientConnectionManager.get(ws)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }

    if(!user.canAdd) {
        throw new Error(INSUFFICIENT_PERMISSIONS)
    }

    let newSong: Song;

    newSong = await SongManager.add({...message, user})

    user.room.songs.push(newSong)

    broadCastCurrentSongChangeEvent(user)
}
