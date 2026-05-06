import { Request, Response } from "express";

const createUser = (req: Request, res: Response) => {
    // 프론트엔드가 요청한 정보를 꺼냄

    const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
        req.body;
    // Json -> 객체로 바꿀 때 가능한건, string, boolean, number, null만 가능함
    // 날짜는 JSON.parse() 해도 string

    const newUser = {
        username,
        password,
        name,
        nickname,
        email,
        phoneNumber,
        birthdate: birthdate ?  new Date(birthdate) : null,
        gender,
        role,
    };
};


export default {createUser,}