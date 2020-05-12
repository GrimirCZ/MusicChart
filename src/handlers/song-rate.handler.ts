import { SongRateMessage } from "../types/message.type";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');
import { SONG_NOT_FOUND, USER_NOT_FOUND } from "../config/errors";

export default (ws: WebSocket, message: SongRateMessage) => {
    const user = ClientConnectionManager.get(ws)
    const song = SongManager.get(message.songId)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }
    if(song === undefined) {
        throw new Error(SONG_NOT_FOUND)
    }

    for(let rating of song.ratings) {
        if(rating.user.id === user.id) {
            rating.value = message.newRating
        }
    }

    broadcastSongListChange(user)
}
