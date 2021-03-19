import { User } from "./user.type";
import { Song } from "./song.type";
import { Timestamp } from "./timestamp.type";

export type RightEnum = "admin" | "all"

export interface Room {
    roomId: string
    name: string

    musicAdd: RightEnum
    musicControl: RightEnum

    adminId?: string
    adminName?: string
    users: User[]

    songs: Song[]

    currentSongId?: string
    // currentSong?: Song
    lastChangeUserId?: string
    lastChangeUserName?: string
    timeOfLastChangeStart?: Timestamp

    activeUsers?: number,

    currentSongState: "playing" | "paused";
    currentSongTime: number;
    since: number;
}
