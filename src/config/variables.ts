import * as assert from "assert";
import { doesNotHaveValue } from "../util";

const envBoolean = (v?: string | null) => {
    if(doesNotHaveValue(v)){
        return false
    }
    const normalized = v.toLowerCase()

    return normalized === "yes" || normalized === "on" || normalized === "true"
}

export const YOUTUBE_API_KEY = process.env['YOUTUBE_API_KEY']

export const WS_PORT = parseInt(process.env['WS_PORT']) || 8080
export const HTTP_PORT = parseInt(process.env['HTTP_PORT']) || 8000

export const DB_DEBUG = envBoolean(process.env["DB_DEBUG"])

export const MONGO_USER = process.env['MONGO_USER']
export const MONGO_PASSWORD = process.env['MONGO_PASSWORD']
export const MONGO_USE_AUTH = envBoolean(process.env['MONGO_USE_AUTH'])
export const MONGO_HOST = process.env['MONGO_HOST']
export const MONGO_PORT = process.env['MONGO_PORT'] || 27017
export const MONGO_DB_NAME = process.env['MONGO_DB_NAME'] || "music_chart"
let _mongo_uri = process.env["MONGO_URI"]

if(!_mongo_uri) {
    _mongo_uri = "mongodb://"

    if(MONGO_USE_AUTH) {
        _mongo_uri += MONGO_USER + ":" + MONGO_PASSWORD + "@"
    }

    _mongo_uri += MONGO_HOST

    if(MONGO_PORT) _mongo_uri += ":" + MONGO_PORT
    if(MONGO_DB_NAME) _mongo_uri += "/" + MONGO_DB_NAME
}

export const MONGO_URI = _mongo_uri

type DBMode = "in-memory" | "mongodb"
export const DB_MODE: DBMode = <DBMode>process.env["DB"] || "in-memory"

assert(["in-memory", "mongodb"].includes(DB_MODE), "Only supported database backends are mongodb and in-memory")

console.log(`Application is using ${DB_MODE} backend`)

export const CHANGE_PROPAGATION_TIMOUT = 1
