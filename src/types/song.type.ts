import { Rating } from "./rating.type";
import { User } from "./user.type";
import { Room } from "./room.type";

export type Song = {
    id: string
    youtubeId: string

    name: string

    user: User
    room: Room

    ratings: Rating[]

    hasPlayed: boolean
}
