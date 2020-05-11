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
], (req: Request, res: Response) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {id} = RoomManager.add(req.body);

    return res.json({
        roomId: id
    })
})

router.post("/connect", [
    body("userName").isString(),
    body("roomId").isString()
], (req: Request, res: Response) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const room = RoomManager.get(req.body.roomId)

    if(room === undefined) {

        return res.status(401).json({errors: [ROOM_NOT_FOUND]});
    }

    const isAdmin = room.admin === null;
    const canControl =
        room.musicControl === "admin" && isAdmin
        || room.musicControl === "all"
    const canAdd =
        room.musicControl === "admin" && isAdmin
        || room.musicControl === "all"

    const newUser = UserManager.add({
        userName: req.body.userName,
        isAdmin,
        canControl,
        canAdd,
        room
    })

    if(isAdmin) {
        room.admin = newUser
        room.lastChangeUser = newUser
    }
    room.users.push(newUser)

    return res.json({
        userId: newUser.id,
        userName: newUser.name,
        isAdmin,

        canControl,
        canAdd,

        roomName: room.name,
        adminName: room.admin.name
    })
})

export default router
