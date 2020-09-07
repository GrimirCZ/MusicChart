import { SongChangeMessage } from "../types/message.type";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import { CHANGE_PROPAGATION_TIMOUT } from "../config/variables";
import { broadcastCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import WebSocket = require('ws');
import { getCurrentTimestamp } from "../helpers/get-current-timestamp";
import { INSUFFICIENT_PERMISSIONS, SONG_NOT_FOUND, USER_NOT_FOUND } from "../config/errors";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { CURRENT_SONG_CHANGED, NEW_SONG_ADDED } from "../types/notification-data.type";

export default (ws: WebSocket, message: SongChangeMessage) => {
    const user = ClientConnectionManager.get(ws)
    const newSong = SongManager.get(message.newSongId)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }
    if(newSong === undefined) {
        throw new Error(SONG_NOT_FOUND)
    }
    if(!user.canControl) {
        throw new Error(INSUFFICIENT_PERMISSIONS)
    }

    newSong.hasPlayed = true
    user.room.currentSong = newSong
    user.room.currentSongState = message.state
    user.room.currentSongTime = message.time
    user.room.since = getCurrentTimestamp() + 5

    broadcastCurrentSongChangeEvent(user)
}
