import { Rating } from "./rating.type";
import { User } from "./user.type";
import { Room } from "./room.type";

export type VideoProvider = "youtube"

export type Song = {
    id: string
    youtubeId: string
    provider: VideoProvider,

    name: string

    ratings: Rating[]

    authorId: string
    authorName: string

    hasPlayed: boolean
}
