import dotenv from "dotenv";
import express from "express";
import * as console from "node:console";
import * as process from "node:process";

dotenv.config();


const app = express();



const PORT = process.env.PORT || "8080";

// express 앱에 기능을 확장할 때에는 app.use() 메서드를 사용

// express.json() : 요청(Request)의 본문(body)에서 JSON 데이터를 객체로 변환(피싱)하여 request.body 에 저장
app.use(express.json());

// express.urlencoded() : 요청(Request)의 본문(body)에서 URL-encoded 데이터를 객체로 변환(파싱)하여 request.body 에 저장
// URL은 한글을 원래 포함할 수 없기 떄문에 변환을 하게 되는데, 그것을 한글로 받아들일 수 있도록 하는 기능
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});

