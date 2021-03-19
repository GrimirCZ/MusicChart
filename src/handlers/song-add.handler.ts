import { SongAddMessage } from "../types/message.type";
import { broadcastCurrentSongChangeEvent } from "../emitters/emit-current-song-change.event";
import wss from "../config/ws.server";
import { Song } from "../types/song.type";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');
import { INSUFFICIENT_PERMISSIONS, USER_NOT_FOUND } from "../config/errors";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import { broadcastNotification } from "../emitters/emit-notification.event";
import { NEW_SONG_ADDED, USER_DISCONNECTED } from "../types/notification-data.type";
import UserManager from "../managers/user.manager";
import RoomManager from "../managers/room.manager";

export default async (ws: WebSocket, message: SongAddMessage) => {
    const user = await UserManager.getById(await ClientConnectionManager.getUserIdFromConnection(ws))

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }

    if(!user.canAdd) {
        throw new Error(INSUFFICIENT_PERMISSIONS)
    }

    const room = await RoomManager.getByUserId(user.id)

    let newSong: Song;

    newSong = await SongManager.add({...message, user, room})

    room.songs.push(newSong)

    await RoomManager.save(room)

    broadcastSongListChange(room)
    broadcastNotification(room, {
        message: NEW_SONG_ADDED,
        data: {
            addedSongName: newSong.name,
            userName: user.name
        }
    })
}
