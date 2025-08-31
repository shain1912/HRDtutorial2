import express from "express";
import { home, redirect, target } from "../controllers/indexController.js";

const router = express.Router();

// GET / - 홈페이지 (users로 리디렉션)
router.get("/", home);

// GET /redirect - 리디렉션 테스트
router.get("/redirect", redirect);

// GET /target - 리디렉션 도착 페이지
router.get("/target", target);

export default router;