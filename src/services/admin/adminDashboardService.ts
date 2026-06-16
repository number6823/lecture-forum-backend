import prisma from "../../config/prisma.ts";

const getDashboardSummary = async () => {
    // async = await 을 통해 진행 하게 되면
    // await이 붙은 비동기함수가 실행이 끝나고 결과가 도출될 때 까지 기다리겠다는 의미이므로
    // 총 0.5초 씩 걸리는 await 비동기 함수 3개를 실행하면
    // 총 1.5초 걸림 -> 비효율적임

    // "비동기함수들"을 묶어서 처리하는 방법이 존재함 => 병렬처리

    const [users, posts, inquiries] = await Promise.all([
        await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        await prisma.post.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        email: true,
                    },
                },
            },
        }),
        await prisma.inquiry.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        email: true,
                    },
                },
            },
        }),
    ]);


    // const users = await prisma.user.findMany({
    //     where: {
    //         deletedAt: null,
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    //     take: 5,
    // });
    //
    // const posts = await prisma.post.findMany({
    //     where: {
    //         deletedAt: null,
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    //     take: 5,
    //     include: {
    //         user: {
    //             select: {
    //                 id: true,
    //                 nickname: true,
    //                 email: true,
    //             },
    //         },
    //     },
    // });
    //
    // const inquiries = await prisma.inquiry.findMany({
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    //     take: 5,
    //     include: {
    //         user: {
    //             select: {
    //                 id: true,
    //                 nickname: true,
    //                 email: true,
    //             },
    //         },
    //     },
    // });

    return {
        users,
        posts,
        inquiries,
    };
};

export default {
    getDashboardSummary,
};
