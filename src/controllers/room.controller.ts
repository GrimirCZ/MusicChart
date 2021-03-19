import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import RoomManager from "../managers/room.manager";
import UserManager from "../managers/user.manager";
import { ROOM_NOT_FOUND } from "../config/errors";

const router = Router();

router.post("/create", [
    body("roomName").isString(),
    body("musicControl").isIn(["admin", "all"]),
    body("musicAdd").isIn(["admin", "all"])
], async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {roomId} = await RoomManager.add(req.body);

    return res.json({
        roomId: roomId
    })
})

router.post("/connect", [
    body("userName").isString(),
    body("roomId").isString()
], async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const room = await RoomManager.get(req.body.roomId)

    if(room === undefined) {

        return res.status(401).json({errors: [ROOM_NOT_FOUND]});
    }

    const isAdmin = room.adminId === null;
    const canControl =
        room.musicControl === "admin" && isAdmin
        || room.musicControl === "all"
    const canAdd =
        room.musicAdd === "admin" && isAdmin
        || room.musicAdd === "all"

    const newUser = await UserManager.add({
        userName: req.body.userName,
        isAdmin,
        canControl,
        canAdd,
        room
    })

    if(isAdmin) {
        room.adminId = newUser.id
        room.adminName = newUser.name
        room.lastChangeUserId = newUser.id
        room.lastChangeUserName = newUser.name
    }
    room.users.push(newUser)
    room.songs.forEach(song => {
        song.ratings = [...song.ratings, {
            userId: newUser.id,
            userName: newUser.name,
            value: 0
        }]
    })

    return res.json({
        userId: newUser.id,
        userName: newUser.name,
        isAdmin,

        canControl,
        canAdd,

        roomName: room.name,
        adminName: room.adminName
    })
})

export default router
