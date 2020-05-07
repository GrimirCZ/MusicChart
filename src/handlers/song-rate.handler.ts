import { SongRateMessage } from "../types/message.type";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');

export default (ws: WebSocket, message: SongRateMessage) => {
    const user = ClientConnectionManager.get(ws)
    const song = SongManager.get(message.songId)

    for(let i in song.ratings) {
        if(song.ratings[i].user.id === user.id) {
            song.ratings[i].value = message.newRating
        }
    }

    broadcastSongListChange(user)
}
