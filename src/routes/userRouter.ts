import { Router } from "express";
import userController from "../controllers/userController.ts";
import {validate} from "../middlewares/validate.ts";
import {createUserSchema} from "../schemas/user/createUser.ts";

const router = Router()

//  /user/create 라고 post 방식 요청이 도착하면 이 아래줄이 실행
router.post("/create", validate(createUserSchema), userController.createUser)


export default router;