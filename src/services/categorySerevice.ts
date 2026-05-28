import prisma from "../config/prisma.ts";

const getActiveCategories = async () => {
    // SELECT * FROM category WHERE status = 'ACTIVE' ORDER By id DESC
    return prisma.category.findMany({
        where: {
            status: "ACTIVE",
        },
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
            name: true,
        }
    });
};

export default {
    getActiveCategories,
};
