import express from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";

const MySQLStore = MySQLStoreFactory(session);

const app = express();
const port = 3003;

// MySQL 연결 설정
const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "session_db",
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: "mySecretKey", // 세션 쿠키 서명을 위한 키
    store: sessionStore, // MySQL 세션 스토어 사용
    resave: false, // 요청마다 세션을 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션 저장 여부
    cookie: {
      maxAge: 1000 * 60 * 30, // 세션 쿠키 유효 시간 (30분)
      httpOnly: true, // JavaScript로 쿠키 접근 불가
    },
  })
);
app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`방문 횟수: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send("처음 방문하셨습니다!");
  }
});

app.get("/delete-session", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("세션 삭제 실패");
    } else {
      res.send("세션이 삭제되었습니다");
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
