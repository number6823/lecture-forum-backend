import { Router } from "express";
import adminCategoryRouter from "./category/adminCategoryRouter.ts";
import adminUserRouter from "./user/adminUserRouter.ts";
import { authenticate, requiredAdmin } from "../../middlewares/auth.ts";

const router = Router()

router.use(authenticate);
router.use(requiredAdmin);


router.use("/category",adminCategoryRouter)
router.use("/user",adminUserRouter)
export default router;