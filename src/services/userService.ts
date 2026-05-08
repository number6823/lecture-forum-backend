import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Prisma error 객체 내부에 code 항목 값이 "P2002"인 것이
            // 중복값이 있을 때의 에러코드임
            if (error.code === "P2002") {
                // 중복된 칼럼이 어떤 것인지에 대한 정보는
                // error.meta?.target에 들어있는데 이프로퍼티 타입은 string[] | undefined
                const errorMessage = error.message;

               // 예시: target = ["username", "nickname"]
                // array의 요소 중 "이 값"이 있는지 확인하는 메서드는 .includes()
                // .find()와 비슷한 역할이지만,
                // find는 조건을 걷어서 찾을 수 있는 메서드이고
                // includes는 단순히 집어넣은 값과 완벽히 같은 것이 있는지 true/false로 찾음

                if (errorMessage.includes("username")) {
                    // 상위 함수로 던지는데,
                    // 새로운 자바스크립트 표준 에러 객체를 만들어서 던짐.
                    // 내용에 "ALREADY_EXISTS_USERNAME"이라고 담아서.
                    throw new Error("ALREADY_EXISTS_USERNAME")
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("UNKNOWN_ERROR");
            }
        }

        throw new Error("UNKNOWN_ERROR"); // return과 같은데 값을 리턴하는게 아니라 에러를 리턴하는 키워드
    }
    // 컨트롤러에서 만들어진 newUser를 받아서, prisma를 통해 DB에 저장
    // prisma.테이블.create(객체) : INSERT하는 메서드 => 리턴 값이 생성된 User 객체
    // prisma는 DB와 통신을 하는 ORM이므로, 당연히 비동기 함수 => async - await
    // create(비동기함수)를 생성하면 User 객체가 반환되는데, 그걸 바로 return 시킬거면
    // await 키워드를 생략함. 대신 async는 빼면 안됨.
};

export default {
    createUser,
};
