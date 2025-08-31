import express from "express";
import asyncHandler from "express-async-handler";

const app = express();
const port = 3005;

app.use(express.json());

// 가상의 비동기 DB 함수들
const fakeDatabase = {
  users: [
    { id: 1, name: "김철수", email: "kim@test.com" },
    { id: 2, name: "박영희", email: "park@test.com" }
  ],
  
  async findUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === parseInt(id));
        if (user) {
          resolve(user);
        } else {
          reject(new Error("사용자를 찾을 수 없습니다"));
        }
      }, 1000); // 1초 지연 시뮬레이션
    });
  },
  
  async createUser(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!userData.name || !userData.email) {
          reject(new Error("이름과 이메일은 필수입니다"));
          return;
        }
        const newUser = { 
          id: this.users.length + 1, 
          ...userData 
        };
        this.users.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },
  
  async throwError() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("의도적인 에러 발생"));
      }, 500);
    });
  }
};

// async/await 없이 (에러 처리가 복잡함)
app.get("/user-without-handler/:id", (req, res, next) => {
  fakeDatabase.findUser(req.params.id)
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      next(error); // 수동으로 에러 처리
    });
});

// express-async-handler 사용 (깔끔한 에러 처리)
app.get("/user/:id", asyncHandler(async (req, res) => {
  const user = await fakeDatabase.findUser(req.params.id);
  res.json(user);
}));

// 사용자 생성
app.post("/user", asyncHandler(async (req, res) => {
  const newUser = await fakeDatabase.createUser(req.body);
  res.status(201).json(newUser);
}));

// 모든 사용자 조회
app.get("/users", asyncHandler(async (req, res) => {
  // 간단한 비동기 작업
  await new Promise(resolve => setTimeout(resolve, 100));
  res.json(fakeDatabase.users);
}));

// 의도적 에러 발생 테스트
app.get("/error-test", asyncHandler(async (req, res) => {
  await fakeDatabase.throwError();
  res.json({ message: "이 메시지는 보이지 않습니다" });
}));

// 여러 비동기 작업
app.get("/multiple-async", asyncHandler(async (req, res) => {
  const user1 = await fakeDatabase.findUser(1);
  const user2 = await fakeDatabase.findUser(2);
  
  res.json({
    message: "여러 비동기 작업 완료",
    users: [user1, user2]
  });
}));

// 병렬 비동기 작업
app.get("/parallel-async", asyncHandler(async (req, res) => {
  const [user1, user2] = await Promise.all([
    fakeDatabase.findUser(1),
    fakeDatabase.findUser(2)
  ]);
  
  res.json({
    message: "병렬 비동기 작업 완료",
    users: [user1, user2]
  });
}));

// 전역 에러 핸들러
app.use((error, req, res, next) => {
  console.error("에러 발생:", error.message);
  res.status(500).json({
    error: error.message,
    note: "express-async-handler가 자동으로 에러를 여기로 전달했습니다"
  });
});

app.listen(port, () => {
  console.log(`Async Handler 테스트 서버가 http://localhost:${port} 에서 실행 중입니다.`);
  console.log("테스트 방법:");
  console.log("1. GET /users - 모든 사용자");
  console.log("2. GET /user/1 - 사용자 1 조회");
  console.log("3. GET /user/999 - 없는 사용자 (에러 테스트)");
  console.log("4. POST /user - 사용자 생성");
  console.log("5. GET /error-test - 에러 발생 테스트");
  console.log("6. GET /multiple-async - 순차 비동기");
  console.log("7. GET /parallel-async - 병렬 비동기");
});