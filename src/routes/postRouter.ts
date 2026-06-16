import { Router } from "express";
import postController from "../controllers/postController.ts";
import { validate } from "../middlewares/validate.ts";
import { createPostSchema } from "../schemas/post/createPostSchema.ts";
import { authenticate, checkUser } from "../middlewares/auth.ts";
import { votePostSchema } from "../schemas/post/votePostSchems.ts";


const router =  Router();

router.get("/list/:categoryId", postController.getPostsByCategory );
router.get("/recent",postController.getRecentPosts);
router.get("/:id", checkUser,postController.getPostById);
router.post("/create", authenticate,validate(createPostSchema),postController.createPost);

router.post("/:postId/vote", authenticate, validate(votePostSchema), postController.votePost);
router.delete("/:postId/vote",authenticate,postController.cancelVotePost);


export default router;

// 주소값 : 동적 라우팅을