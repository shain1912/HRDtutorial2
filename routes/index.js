import express from 'express';

const router = express.Router();

// 루트 경로: 간단한 환영 메시지 렌더링
router.get('/', (req, res) => {
  res.render('index', { 
    title: '백엔드 API 테스트'
  });
});

// 리디렉션을 수행할 경로
router.get('/redirect', (req, res) => {
  console.log('리디렉션 시작...');
  res.redirect('/target');
});

// 리디렉션 도착 경로
router.get('/target', (req, res) => {
  res.render('target', { message: '성공적으로 리디렉션되었습니다!' });
});

// 로그인 폼 제출 처리
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 데모를 위해 올바른 아이디/비밀번호를 하드코딩합니다.
  const validUsername = 'admin';
  const validPassword = 'password';

  if (username === validUsername && password === validPassword) {
    // 로그인 성공
    console.log('로그인 성공, 사용자:', username);
    res.redirect('/welcome.html');
  } else {
    // 로그인 실패
    console.log('로그인 실패, 사용자:', username);
    // 에러 쿼리 파라미터와 함께 로그인 페이지로 리디렉션합니다.
    res.redirect('/index.html?error=1');
  }
});

export default router;
