import express from "express";
import { index, newUser, show, edit, create, update, destroy } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /users - 모든 사용자 목록
router.get("/", requireAuth, index);

// GET /users/new - 새 사용자 생성 폼
router.get("/new", requireAuth, newUser);

// GET /users/:id - 특정 사용자 조회
router.get("/:id", requireAuth, show);

// GET /users/:id/edit - 사용자 수정 폼
router.get("/:id/edit", requireAuth, edit);

// POST /users - 새 사용자 생성
router.post("/", requireAuth, create);

// PUT /users/:id - 사용자 정보 업데이트
router.put("/:id", requireAuth, update);

// DELETE /users/:id - 사용자 삭제
router.delete("/:id", requireAuth, destroy);

export default router;