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
import UserManager from "../managers/user.manager";
import RoomManager from "../managers/room.manager";

export default async (ws: WebSocket, message: SongChangeMessage) => {
    const user = await UserManager.getById(await ClientConnectionManager.getUserIdFromConnection(ws))
    const newSong = await SongManager.getBySongId(message.newSongId)

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

    const room = await RoomManager.getByUserId(user.id)

    room.currentSongId = newSong.id
    room.currentSongState = message.state
    room.currentSongTime = message.time
    room.lastChangeUserId = user.id
    room.lastChangeUserId = user.name
    room.since = getCurrentTimestamp() + 5

    await RoomManager.save(room)

    broadcastCurrentSongChangeEvent(room, newSong)
}
