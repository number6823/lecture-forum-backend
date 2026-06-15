import { Router } from "express";
import userController from "../controllers/userController.ts";
import { validate } from "../middlewares/validate.ts";
import { createUserSchema } from "../schemas/user/createUser.ts";
import { loginSchema } from "../schemas/user/login.ts";
import { authenticate } from "../middlewares/auth.ts";
import { updateUserSchema } from "../schemas/user/updateUserSchema.ts";
import { WithdrawUserSchema } from "../schemas/user/withdrawUserSchema.ts";

const router = Router();

router.post("/create", validate(createUserSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.login);
router.patch("/update", authenticate,validate(updateUserSchema), userController.updateUser);
router.patch("/password", authenticate,validate(updateUserSchema),userController.updatePassword)
router.delete("/withdraw",authenticate,validate(WithdrawUserSchema),userController.withdrawUser )


export default router;
