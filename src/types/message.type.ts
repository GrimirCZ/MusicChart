import { has } from "lodash"
import { Any, Nullable, Primitive, validate } from 'validate-typescript';

type MessageTypeEnum = "health-check" | "client-connect" | "song-add" | "song-remove" | "song-rate" | "song-change"


export const isValidMessage = (data: any) => {
    return has(data, "type")
}

export type Message = {
    type: MessageTypeEnum,
}

export const validateClientConnectMessage = (message: Message): ClientConnectMessage => {
    return validate<ClientConnectMessage>({
        type: "client-connect",
        userId: Primitive(String)
    }, message)
}

export interface ClientConnectMessage extends Message {
    userId: string
}


export const validateSongAddMessage = (message: Message): SongAddMessage => {
    return validate<SongAddMessage>({
        type: "song-add",
        songUrl: Primitive(String)
    }, message)
}

export interface SongAddMessage extends Message {
    songUrl: string,
}


export const validateSongRemoveMessage = (message: Message): SongRemoveMessage => {
    return validate<SongRemoveMessage>({
        type: "song-remove",
        songId: Primitive(String)
    }, message)
}

export interface SongRemoveMessage extends Message {
    songId: string,
}


export const validateSongRateMessage = (message: Message): SongRateMessage => {
    return validate<SongRateMessage>({
        type: "song-rate",
        songId: Primitive(String),
        newRating: Primitive(Number)
    }, message)
}

export interface SongRateMessage extends Message {
    songId: string
    newRating: number
}


export const validateSongChangeMessage = (message: Message): SongChangeMessage => {
    return validate<SongChangeMessage>({
        type: "song-change",
        newSongId: Primitive(String),

        state: Any(["playing", "paused"]),
        time: Nullable(Primitive(Number))
    }, message)
}

export interface SongChangeMessage extends Message {
    newSongId: string

    state: "playing" | "paused"
    time?: number
}
