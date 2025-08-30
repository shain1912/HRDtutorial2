import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 라우터 임포트
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

const app = express();
const port = 3002;

// ES 모듈에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

// POST 요청 본문 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공을 위한 미들웨어
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 마운트
app.use("/", indexRouter); // 페이지 렌더링 라우터
app.use("/api", apiRouter); // API 라우터

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
