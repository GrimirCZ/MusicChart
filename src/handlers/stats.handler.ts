import ClientConnectionManager from "../managers/client-connection.manager";
import RoomManager from "../managers/room.manager";
import {Request, Response} from "express"

export const statHandler = (req: Request, res: Response) => {
    res.status(200).json({
        activeUsers: ClientConnectionManager.count(),
        activeRooms: RoomManager.activeRoomCount(),
    })
}
