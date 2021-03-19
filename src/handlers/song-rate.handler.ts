import { SongRateMessage } from "../types/message.type";
import { broadcastSongListChange } from "../emitters/emit-song-list-change.event";
import SongManager from "../managers/song.manager";
import ClientConnectionManager from "../managers/client-connection.manager";
import WebSocket = require('ws');
import { SONG_NOT_FOUND, USER_NOT_FOUND } from "../config/errors";
import UserManager from "../managers/user.manager";
import RoomManager from "../managers/room.manager";

export default async (ws: WebSocket, message: SongRateMessage) => {
    const user = await UserManager.getById(await ClientConnectionManager.getUserIdFromConnection(ws))

    if(user === undefined) {
        throw new Error(USER_NOT_FOUND)
    }

    const room = await RoomManager.getByUserId(user.id)

    let found = false;

    // need to retain correct reference
    // FIXME: figure out something better
    for(const song of room.songs){
        if(song.id === message.songId){
            for(const rating of song.ratings) {
                if(rating.userId === user.id) {
                    rating.value = message.newRating
                    break;
                }
            }

            found = true;
            break;
        }
    }

    if(!found){
        throw new Error(SONG_NOT_FOUND)
    }

    await RoomManager.save(room)

    broadcastSongListChange(room)
}
