import { Room } from "./room.type";

export type User = {
    id: string

    name: string
    isAdmin: boolean

    canControl: boolean
    canAdd: boolean

    room: Room
}
