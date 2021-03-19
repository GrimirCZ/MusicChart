import { model, Schema } from "mongoose";

import { Document, Model } from "mongoose";
import { Room } from "../../types/room.type";

const RoomSchema = new Schema({
    roomId: String,
    name: String,

    musicAdd: String,
    musicControl: String,

    adminId: String,
    adminName: String,
    users: Array,

    songs: Array,

    currentSongId: String,
    lastChangeUserId: String,
    lastChangeUserName: String,
    timeOfLastChangeStart: Number,

    activeUsers: Number,

    currentSongState: String,
    currentSongTime: Number,
    since: Number
});


export interface IRoomDocument extends Room, Document {
}

export interface IRoomModel extends Model<IRoomDocument> {
}

export const RoomModel = model<IRoomDocument>("room", RoomSchema);
