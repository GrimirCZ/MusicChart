export const NEW_USER_CONNECTED = "NEW_USER_CONNECTED"
export const USER_DISCONNECTED = "USER_DISCONNECTED"
export const NEW_SONG_ADDED = "NEW_SONG_ADDED"
export const CURRENT_SONG_CHANGED = "CURRENT_SONG_CHANGED"

export type NotificationData = {
    message: string,
    data: object
}
