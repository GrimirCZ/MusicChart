import { SongChangeMessage } from "../types/message.type";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import { CHANGE_PROPAGATION_TIMOUT } from "../config/variables";
import { broadCastCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import WebSocket = require('ws');
import { getCurrentTimestamp } from "../helpers/get-current-timestamp";

export default (ws: WebSocket, message: SongChangeMessage) => {
    const user = ClientConnectionManager.get(ws)
    const newSong = SongManager.get(message.newSongId)

    if(!user.canControl) {
        return
    }

    user.room.currentSong = newSong
    user.room.timeOfLastChangeStart = getCurrentTimestamp() + CHANGE_PROPAGATION_TIMOUT

    broadCastCurrentSongChangeEvent(user)
}
