import { Router } from "express";
import replyController from "../controllers/replyController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { createReplySchema } from "../schemas/reply/createReplySchema.ts";
import { UpdateReplySchema } from "../schemas/reply/updateReplySchema.ts";

const router = Router();

router.get("/:postId", replyController.getRepliesByPostId);
router.post("/create", authenticate, validate(createReplySchema), replyController.createReply);
router.patch("/:replyId", authenticate, validate(UpdateReplySchema), replyController.updateReply);
router.delete("/:replyId", authenticate, replyController.deleteReply);

export default router;