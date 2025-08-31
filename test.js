//express 의 HTTP 메서드로 라우팅 처리를 합니다..  코드에 빈칸을 채우세요
const express = require("express"); //express 패키지 로드(가져오기
const app = express(); // express application 인스턴스 생성 함수
const port = 3000;

app.set("views", path.join(__dirname, "views")); // 템플릿 폴더 설정
app.set("view engine", "ejs"); // 템플릿 엔진을 ejs로 설정

// index.ejs 페이지를 응답 페이지로 렌더링 설정
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//새 연락처 추가
app.post("/contacts", (req, res) => {
  res.status(201).send("Create Contacts"); //메서드 체이닝
});

app.get("/redirect", (req, res) => {
  res.redirect("/target"); // URL /target으로 리다이렉트 시킴
});
app.get("/target", (req, res) => {
  res.send("<h1>여기는 리다이렉트된 Target 페이지입니다!</h1>");
});
app.listen(port, () => {
  console.log(`Express 서버에서  app(Express객체)가 listening on port ${port}`);
});
