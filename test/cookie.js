import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = 3003;
app.use(cookieParser());

app.get("/", (req, res) => {
  res.cookie("korea", "seoul", { httpOnly: true });
  res.send("쿠키 생성");
});

app.get("/cookie", (req, res) => {
  console.log(req.cookies);
  res.json(req.cookies);
});

app.get("/delete-cookie", (req, res) => {
  res.clearCookie("korea");
  res.send("쿠키삭제");
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
