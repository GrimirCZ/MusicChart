import { INVALID_VIDEO_URL, UNKNOWN_SERVER_ERROR, VIDEO_PROVIDER_NOT_SUPPORTED } from "../config/errors";
import { YOUTUBE_API_KEY } from "../config/variables";
import fetch from "node-fetch";
import { VideoProvider } from "../types/song.type";

const youtubeIdRegexRes =
    /^((http|https):\/\/)?((www|m)\.)?youtube\.(com|cz)?\/watch\?(.+&)*v=(?<id>[^"&?\/\s]+)(&.*)*$/


interface VideoData {
    provider: VideoProvider,
    id: string,
    title: string
}

const getVideoData = async (url: string): Promise<VideoData> => {
    const youtubeData = youtubeIdRegexRes.exec(url)

    if(youtubeData !== null) {
        return getYoutubeVideoData(youtubeData);
    }

    throw new Error(VIDEO_PROVIDER_NOT_SUPPORTED)
}

const getYoutubeVideoData = async (youtubeData: RegExpExecArray): Promise<VideoData> => {
    if(!youtubeData.groups["id"])
        throw new Error(INVALID_VIDEO_URL);

    const youtubeId = youtubeData.groups["id"]

    let title = "Neznámý název videa";

    const url = new URL('https://www.googleapis.com/youtube/v3/videos');

    url.searchParams.append("id", youtubeId)
    url.searchParams.append("key", YOUTUBE_API_KEY)
    url.searchParams.append("part", "snippet")

    const res = await fetch(url.toString()).then(res => res.json())

    if(res.items !== undefined) {
        title = res.items[0].snippet.title;
    } else {
        console.log(res)
    }

    return {
        provider: "youtube",
        id: youtubeId,
        title
    }
}

const VideoService = {
    getVideoData
}

export default VideoService
