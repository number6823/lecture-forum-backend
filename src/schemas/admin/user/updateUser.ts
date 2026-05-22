import { z } from "zod";
import { GenderType, RoleType } from "../../../generated/prisma/enums.ts";

// zod를 통해 검증할 Input값에 대한 객체모양 생성
export const adminUpdateUserSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(6).optional(),
    name: z.string().min(2),
    nickname: z.string().min(2).max(50),
    email: z.email(),
    phoneNumber: z.string().optional(),
    birthdate: z.string().optional(),
    gender: z.enum(GenderType),
    role: z.enum(RoleType),
});

export type AdminUpdateUserInputType = z.infer<typeof adminUpdateUserSchema>;
