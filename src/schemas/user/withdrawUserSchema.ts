import { z } from "zod";

export const WithdrawUserSchema = z.object({
    password: z.string().min(1, "비밀번호는 필수 입력 항목입니다."),
});

export type WithdrawUserInputType = z.infer<typeof WithdrawUserSchema>;
