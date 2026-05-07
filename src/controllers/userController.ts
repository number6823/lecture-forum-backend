import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import UserService from "../services/userService.ts";

const createUser = async (req: Request, res: Response) => {
    try {
        // 프론트엔드가 요청한 정보를 꺼냄

        const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
            req.body;
        // Json -> 객체로 바꿀 때 가능한건, string, boolean, number, null만 가능함
        // 날짜는 JSON.parse() 해도 string

        const userData: UserCreateInput = {
            username,
            password,
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
        console.log(error);
        res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다."})
    }
};

export default { createUser };
