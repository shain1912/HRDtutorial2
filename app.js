import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

// 라우터 임포트
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

// 미들웨어 임포트
import { notFound, globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

// ES 모듈에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// POST 요청 본문 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override 미들웨어
app.use(methodOverride("_method"));

// 세션 미들웨어
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// CSS 파일 정적 제공을 위한 미들웨어
app.use("/css", express.static(path.join(__dirname, "views/css")));

// 라우터 마운트
app.use("/", indexRouter); // 메인 페이지 라우터
app.use("/auth", authRouter); // 인증 관련 라우터
app.use("/users", usersRouter); // 사용자 라우터

// 에러 핸들러
app.use(notFound);
app.use(globalErrorHandler);

export default app;
