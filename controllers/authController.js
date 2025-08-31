import asyncHandler from 'express-async-handler';
import authService from '../services/authService.js';

// GET /auth/login - 로그인 페이지
const getLogin = asyncHandler(async (req, res) => {
  res.render("login", { 
    error: req.query.error, 
    success: req.query.success 
  });
});

// POST /auth/login - 로그인 처리
const postLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  const user = await authService.authenticateUser(username, password);
  
  if (user) {
    req.session.isLoggedIn = true;
    req.session.username = user.username;
    req.session.userid = user.userid;
    console.log("로그인 성공, 사용자:", user.username);
    res.redirect("/users");
  } else {
    console.log("로그인 실패, 사용자:", username);
    res.redirect("/auth/login?error=1");
  }
});

// GET /auth/signup - 회원가입 페이지
const getSignup = asyncHandler(async (req, res) => {
  res.render("signup", { 
    error: req.query.error, 
    success: req.query.success 
  });
});

// POST /auth/signup - 회원가입 처리
const postSignup = asyncHandler(async (req, res) => {
  const { username, password, confirmPassword, email, phone } = req.body;

  const result = await authService.registerUser({
    username,
    password,
    confirmPassword,
    email,
    phone
  });

  if (result.success) {
    console.log("새 사용자 회원가입:", { userid: result.userid, username, email, phone });
    res.redirect("/auth/login?success=1");
  } else {
    res.redirect(`/auth/signup?error=${result.errorCode}`);
  }
});

// POST /auth/logout - 로그아웃
const postLogout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 오류:", err);
    }
    res.redirect("/auth/login");
  });
});

export { getLogin, postLogin, getSignup, postSignup, postLogout };