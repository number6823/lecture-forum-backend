import prisma from "../../config/prisma.ts";
import { CategoryCreateInput } from "../../generated/prisma/models/Category.ts";
import { Prisma } from "../../generated/prisma/client.ts";

const geCategoryList = async () => {
    // findMany() : 데이터베이스에서 여러개의 row SELECT 하는 메서드
    // SELECT * FROM category ORDER BY id DESC
    return prisma.category.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

const createCategory = async (input: CategoryCreateInput) => {
    try {
        // 생성 작업을 마친 prisma는 생성한 그 데이터를 리턴함
        return await prisma.category.create({
            data: input,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("ALREADY_EXIST_CATEGORY_NAME");
            }
        }
        throw error;
    }
};

export default {
    geCategoryList,
    createCategory,
};
