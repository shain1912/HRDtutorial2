import express from "express";
import bcrypt from "bcrypt";

const app = express();
const port = 3004;

app.use(express.json());

// 메모리에 저장할 간단한 사용자 데이터 (실제로는 DB 사용)
const users = [];

// 회원가입 테스트
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "사용자명과 비밀번호를 입력하세요" });
  }

  try {
    // 비밀번호 해시화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 사용자 저장
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);
    
    res.json({ message: "회원가입 성공", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
});

// 로그인 테스트
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "사용자명과 비밀번호를 입력하세요" });
  }

  try {
    // 사용자 찾기
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: "사용자를 찾을 수 없습니다" });
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "비밀번호가 틀렸습니다" });
    }

    res.json({ message: "로그인 성공", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
});

// 해시 비교 테스트
app.get("/hash-test", async (req, res) => {
  const password = "testpassword123";
  
  try {
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    
    const isMatch1 = await bcrypt.compare(password, hash1);
    const isMatch2 = await bcrypt.compare(password, hash2);
    const wrongMatch = await bcrypt.compare("wrongpassword", hash1);
    
    res.json({
      originalPassword: password,
      hash1,
      hash2,
      isMatch1,
      isMatch2,
      wrongMatch,
      note: "같은 비밀번호도 매번 다른 해시가 생성됩니다"
    });
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
});

// 저장된 사용자 목록 보기
app.get("/users", (req, res) => {
  const safeUsers = users.map(({ id, username }) => ({ id, username }));
  res.json(safeUsers);
});

app.listen(port, () => {
  console.log(`Bcrypt 테스트 서버가 http://localhost:${port} 에서 실행 중입니다.`);
  console.log("테스트 방법:");
  console.log("1. POST /register - 회원가입");
  console.log("2. POST /login - 로그인");
  console.log("3. GET /hash-test - 해시 테스트");
  console.log("4. GET /users - 사용자 목록");
});