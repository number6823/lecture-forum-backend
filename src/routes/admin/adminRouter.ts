import adminUserRouter from "./user/adminUserRouter.ts";
import adminNoticeRouter from "./notice/adminNoticeRouter.ts";
import adminCategoryRouter from "./category/adminCategoryRouter.ts";
import { Router } from "express";
import adminInquiryRouter from "./inquiry/adminInquiryRouter.ts";

const router = Router();

router.use("/category", adminCategoryRouter);
router.use("/user", adminUserRouter);
router.use("/notice", adminNoticeRouter);
router.use("/inquiry", adminInquiryRouter);
export default router;
