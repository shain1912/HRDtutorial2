import express from "express";
import { getLogin, postLogin, getSignup, postSignup, postLogout } from "../controllers/authController.js";
import { redirectIfLoggedIn } from "../middleware/auth.js";

const router = express.Router();

// GET /auth/login - 로그인 페이지
router.get("/login", redirectIfLoggedIn, getLogin);

// POST /auth/login - 로그인 처리
router.post("/login", postLogin);

// GET /auth/signup - 회원가입 페이지
router.get("/signup", redirectIfLoggedIn, getSignup);

// POST /auth/signup - 회원가입 처리
router.post("/signup", postSignup);

// POST /auth/logout - 로그아웃
router.post("/logout", postLogout);

export default router;