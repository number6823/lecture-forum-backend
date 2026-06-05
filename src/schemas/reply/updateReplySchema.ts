import { z } from "zod";

export const UpdateReplySchema = z.object({
    content: z.string().min(1, "댓글 내용은 필수값입니다."),
});

export type UpdateReplyInputType = z.infer<typeof UpdateReplySchema>;
