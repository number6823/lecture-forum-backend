import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/userRouter.ts";
import cors from "cors";
import adminRouter from "./routes/admin/adminRouter.ts";
import categoryRouter from "./routes/categoryRouter.ts";
import postRouter from "./routes/postRouter.ts";
import replyRouter from "./routes/replyRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

// express 앱에 기능을 확장할 때에는 app.use() 메서드를 사용

// 교차 출처 리소스 공유 (CORS)를 허용하는건 백엔드에서 증명하여 허용해야 함
// cors() 만 사용하면 모든 프론트엔드 주소에 대해 허용 증명을 하는 것
// cors({ origin : "주소" }) 를 통해 특정 주소에 대해서만 허용 증명을 할 수 있음
app.use(cors({ origin: ["http://localhost:8081", "http://localhost:5173"], credentials: true }));

// express.json() : 요청(Request)의 본문(body)에서 JSON 데이터를 객체로 변환(파싱)하여 request.body 에 저장
app.use(express.json());

// express.urlencoded() : 요청(Request)의 본문(body)에서 URL-encoded 데이터를 객체로 변환(파싱)하여 request.body 에 저장
// URL은 한글을 원래 포함할 수 없기 때문에 변환을 하게 되는데, 그것을 한글로 받아들일 수 있도록 하는 기능
app.use(express.urlencoded({ extended: true }));

// 프론트엔드가 하는 요청(Request)에 대하여 경로 Routing 등록
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
app.use("/reply", replyRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
