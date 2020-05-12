import { User } from "./user.type";
import { Song } from "./song.type";
import { Timestamp } from "./timestamp.type";

export type RightEnum = "admin" | "all"

export type Room = {
    id: string
    name: string

    musicControl: RightEnum
    musicAdd: RightEnum

    admin: User | null
    users: User[]

    songs: Song[]

    currentSong?: Song
    lastChangeUser?: User
    timeOfLastChangeStart?: Timestamp


    currentSongState: "playing" | "paused";
    currentSongTime: number;
    since: number;
}
