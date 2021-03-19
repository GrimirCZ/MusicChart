import { SongRemoveMessage } from "../types/message.type";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');
import { INSUFFICIENT_PERMISSIONS, SONG_NOT_FOUND, USER_NOT_FOUND } from "../config/errors";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { CURRENT_SONG_CHANGED, SONG_REMOVED } from "../types/notification-data.type";
import UserManager from "../managers/user.manager";
import RoomManager from "../managers/room.manager";

export default async (ws: WebSocket, message: SongRemoveMessage) => {
    const user = await UserManager.getById(await ClientConnectionManager.getUserIdFromConnection(ws))
    const song = await SongManager.getBySongId(message.songId)

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }
    if(song === undefined) {
        throw new Error(SONG_NOT_FOUND)
    }

    if(!user.isAdmin && user.id !== song.authorId) {
        throw new Error(INSUFFICIENT_PERMISSIONS)
    }

    const room = await RoomManager.getByUserId(user.id);

    await SongManager.remove(song.id)

    if(room.currentSongId === song.id){
        room.currentSongId = undefined
        room.currentSongState = "paused"
        room.currentSongTime = 0
    }

    await RoomManager.save(room)

    broadcastSongListChange(room)
    broadcastNotification(room, {
        message: SONG_REMOVED,
        data: {
            songName: song.name,
            userName: user.name
        }
    })
}
