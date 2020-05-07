import { SongRemoveMessage } from "../types/message.type";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');

export default (ws: WebSocket, message: SongRemoveMessage) => {
    const user = ClientConnectionManager.get(ws)
    const song = SongManager.get(message.songId)

    if(!user.isAdmin && user.id !== song.user.id) {
        return
    }

    SongManager.remove(song.id)

    song.room.songs = song.room.songs.filter(song => song.id !== message.songId)

    broadcastSongListChange(user)
}
