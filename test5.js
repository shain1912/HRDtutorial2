// http://localhost:3000/statics/login.html 로 정적 리소스를 요청 및 Access할 수 있는 미들웨어를 등록하는 코드
// 정적 리소스가 저장된 디렉토리는 Node 프로젝트 내에 public 디렉토리입니다.

const express = require('express');
const app = express();
const port = 3000;

// 정적 파일 제공 미들웨어 - 빈칸을 채우세요
app.[     ]('/statics', express.[     ]('public'));

// 기본 라우트
app.get('/', (req, res) => {
  res.send(`
    <h1>정적 파일 서버 테스트</h1>
    <p>정적 파일 접근: <a href="/statics/login.html">http://localhost:3000/statics/login.html</a></p>
  `);
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

// 답: 
// app.use('/statics', express.static('public'));
