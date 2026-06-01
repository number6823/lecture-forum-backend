import { Request, Response } from "express";
import postService from "../services/postService.ts";
import { CreatePostInputType } from "../schemas/post/createPostSchema.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import { VotePostInputType } from "../schemas/post/votePostSchems.ts";

const getPostsByCategory = async (req: Request<{ categoryId: string }>, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        // categoryId 검증
        if (isNaN(categoryId)) {
            res.status(400).json({
                message: "유효하지 않은 카테고리 ID 입니다.",
            });
            return;
        }

        // 서비스 호출
        const result = await postService.getPostsByCategory(categoryId, page, size);

        // 응답
        res.status(200).json({
            message: "게시글 목록을 성공적으로 불러왔습니다.",
            data: result,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "서버 에러가 발생되었습니다.",
        });
    }
};

// 컨트롤러는 기본적으로 Express에서 제공해주는 타입인 Request와 Response를 사용해야 했던 것
// 그 규칙 안에 Request에 동적 라우팅을 통해 주소값을 가져오려면 Generic인 Request<{id : string}>
// +
// 우리는 미들웨어를 통해, req라고 하는 요청 내용이 담기는 박스에 req.user 항목을 집어넣기로 한 것
// 그렇기 때문에 AuthRequest라고, Request 타입을 상속받은 것으로 교체할 생각
// =
// 이렇게 했더니, 우리가 만든 AuthRequest는 Generic이 아니라서 동적 라우팅을 받을 수가 없네?
// 이걸 어떻게든 해결을 해야 된다면?
// GET 방식으로 받게끔 디자인 했기 때문에 동적 라우팅을 썻던 것
// POST 방식으로 하면 req.body를 쓸 수 있게됨
// GET 방식은 조회 할때 쓰고 POST는 생성 PATCH와 PUT은 수정 DELECT는 지울 떄 쓰고
// 느슨하게 적용ㅇ을 해도 됨. => 이렇게 난눈 것은 백엔드와 프론트엔드가 합의하면 어겨도 됨

// POST방식으로 교체하면 문제 해결이 가능하지만,
// GET 방식을 고수하여 정석적으로 해결을 하려 한다면, 우리가 만든 AuthRequest 인터페이스가
// 부모 인터페이스인 Request의 제네릭을 수용할 수 있도록 고쳐야 함

const getPostById = async (req: AuthRequest<{ id: string }>, res: Response) => {
    // 원래, 글 내용 조회라는 기능엔 "조회하는 사람이 누군가"는 중요하지 않았음
    // 근데 "조회하는 사람이" 투표를 했나 안 했나를 알기 위해서는 "그 사람이" 누군가를 알아야 함

    // 글의 내용을 요청하는 사람에 대한 정보를 알기 위해서는 어디에 접근해야 하는가?
    try {
        const postId = Number(req.params.id);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은  게시글 ID 입니다." });
            return;
        }
        const userId = req.user?.id;
        const post = await postService.getPostById(postId, userId);

        res.status(200).json({
            message: "게시글을 성공적으로 불러왔습니다.",
            data: post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const createPost = async (req: AuthRequest, res: Response) => {
    // req.body 에 들어온 값들을 꺼내서, 서비스로 보내줘야 함
    // 즉,req.body로 들어온 내용을 토대로 데이터베이스에 쓸 수 있는 타입 객체로 바꿔서 보내야 함
    try {
        // 지금 요청을 하고 있는 사람이 누군지를 알아내어, 데이터베이스에서 그 사용자 정보와 post를 연결해야 함
        // 누군지 알아내려면 그 정보는 req.headers.authorization 을 까서
        // 그 token을 복호화 하면 { userIDL number } 정보를 통해 user 테이블에서 사용자 정보를 불러오고
        // 그 사용자의 ID를 가지고 연결을 지어야 함

        // 근데 이 과정을 보니, 우리가 middleware로 만들어놨던 authenticate 가 하는 일이랑 똑같네?
        // authenticate를 보니, req 박스에다가 이미 user라는 항목을 만들어서 스티커를 붙여서 보내주고 있네~
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
        }

        const { title, content, categoryId, option1Text, option2Text }: CreatePostInputType =
            req.body;

        // option1Text, option2Text의 문제는 undefined타입은 Javascript에만 존재하기 때문. 데이터베이스엔 없음.
        const postData: PostCreateInput = {
            title,
            content,
            category: { connect: { id: categoryId } },
            user: { connect: { id: user.id } },
            option1Text: option1Text ?? null,
            option2Text: option2Text ?? null,
        };

        // post 테이블은 user 테이블과 category 테이블과 관계를 맺고 있음
        const newPost = await postService.createPost(postData);

        res.status(201).json({
            message: "게시글이 성공적으로 작성되었습니다.",
            data: newPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "게시글 작성 중 서버 에러가 발생되었습니다." });
    }
};

export const votePost = async (req: AuthRequest<{ postId: string }>, res: Response) => {
    // 투표가 이루어지는 글번호(ID) => 동적 라우팅을 통해 주소 => AuthRequest에 제네릭
    // 투표를 한 사람의 ID   => req.user => req라는 요청 내용 박스의 모양이 바뀌어야 함
    // 어디에 투표를 했는지 => req.body
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시물 ID입니다." });
            return;
        }

        // authenticate라는 미들웨어로 사용자가 무조건 존재해야 여기에 도달한다고 제한을 뒀지만,
        // 그것은 내가 할 뿐, 이 파일만 보고 있는 Typescript 엔진은 모름
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
            return;
        }
        const userId = req.user.id;

        const { option }: VotePostInputType = req.body;

        await postService.votePost(postId, userId, option);
        res.status(200).json({ message: "투표 결과가 정상적으로 저장되었습니다." });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 게시물입니다." });
                return;
            }
            if (error.message === "NOT_VOTABLE") {
                res.status(400).json({ message: "투표가 활성화되지 않은 게시물입니다." });
                return;
            }
            if (error.message === "ALREADY_VOTED") {
                res.status(409).json({ message: "이미 투표에 참여하셨습니다." });
                return;
            }
            console.log(error);
            res.status(500).json({ message: "투표 처리 중 서버 에러가 발생했습니다." });
        }
    }
};

export default {
    getPostsByCategory,
    createPost,
    getPostById,
    votePost,
};
