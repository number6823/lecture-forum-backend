import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import UserService from "../services/userService.ts";
import passwordUtil from "../utils/password/passwordUtil.ts";
import userService from "../services/userService.ts";
import { LoginInputType } from "../schemas/user/login.ts";

const createUser = async (req: Request, res: Response) => {
    try {
        // 프론트엔드가 요청한 정보를 꺼냄

        const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
            req.body;
        // Json -> 객체로 바꿀 때 가능한건, string, boolean, number, null만 가능함
        // 날짜는 JSON.parse() 해도 string

        // bcrypt.hash(암호화할string, 암호화단계숫자) : 비동기함수, 단방향 암호화 메서드
        const userData: UserCreateInput = {
            username,
            password: await passwordUtil.hashPassword(password),
            name,
            nickname,
            email,
            phoneNumber,
            birthdate: birthdate ? new Date(birthdate) : null,
            gender,
            role,
        };
        const newUser = await UserService.createUser(userData);


        // 여기서부터는 응답(Response) 처리
        // res라는, 앞으로 응답에 나갈 박스에
        // status code를 201 (생성 작업 성공의 코드) 로 하고
        // 응답에 들어갈 string 데이터로 newUser를 json 가공하여 넣는다
        res.status(201).json(newUser);
    } catch (error) {
        // 모든 에러에 대해서 처리를 해줄 순 없음.
        //내가 처리해줄 수 있는 대표적 에러에 대해서만 대처함.
        // 매개변수 error는 unknown 타입임
        //unknown 타입은 any 타입처럼 모든 값들이 저장될 수 있는 타입이지만,
        // 사용하기 위해서는 내로잉(타입 좁힘)을 통해 사용이 가능함
        if (error instanceof Error) {
            switch (error.message) {
                case "ALREADY_EXISTS_USERNAME":
                    res.status(409).json({ message: "이미 사용 중인 아이디입니다. " });
                    return;
                case "ALREADY_EXISTS_EMAIL":
                    res.status(409).json({ message: "이미 가입된 이메일입니다. " });
                    return;
                case "ALREADY_EXISTS_NICKNAME":
                    res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
                    return;
                default:
                    console.log(error);
                    res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다" });
            }
        }

        // username이 겹칠 떄
        // nickname이 겹칠 때
        // email이 겹칠 때
        console.log(error);
        res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다." });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        // Login 이라는 기능은, 들어온 비밀번호 값과 데이터베이스에서 조회해서 가져온 비밀번호 값을
        // 비교해야 함.
        // 뭔가를 Controller에서 해주기 보다,DB에 값을 가져오는게 우선되므로
        // 그냥 service 로 바로 보냄
        const loginData: LoginInputType = req.body;

        const result = await userService.login(loginData);

        res.status(200).json({
            message: "로그인에 성공했습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "INVALID_CREDENTIALS") {
                res.status(401).json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
                return;
            }
        }

        console.log(error);
        res.status(500).json({ message: "로그인 처리 중 서버 에러가 발생했습니다." });
    }
};

export default { createUser, login };
