import { SongRemoveMessage } from "../types/message.type";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');
import { INSUFFICIENT_PERMISSIONS, SONG_NOT_FOUND, USER_NOT_FOUND } from "../config/errors";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { CURRENT_SONG_CHANGED, SONG_REMOVED } from "../types/notification-data.type";

export default (ws: WebSocket, message: SongRemoveMessage) => {
    const user = ClientConnectionManager.get(ws)
    const song = SongManager.get(message.songId)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }
    if(song === undefined) {
        throw new Error(SONG_NOT_FOUND)
    }

    if(!user.isAdmin && user.id !== song.user.id) {
        throw new Error(INSUFFICIENT_PERMISSIONS)
    }

    SongManager.remove(song.id)

    song.room.songs = song.room.songs.filter(song => song.id !== message.songId)

    broadcastSongListChange(user)
    broadcastNotification(user, {
        message: SONG_REMOVED,
        data: {
            songName: song.name,
            userName: user.name
        }
    })
}
