import prisma from "../../config/prisma.ts";

const geCategoryList = async () => {
    // findMany() : 데이터베이스에서 여러개의 row SELECT 하는 메서드
    // SELECT * FROM category ORDER BY id DESC
  return prisma.category.findMany({
        orderBy: {
            id: "desc",
        }
    });
}

export default {
    geCategoryList
}