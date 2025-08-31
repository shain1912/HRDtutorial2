import asyncHandler from 'express-async-handler';
import userService from '../services/userService.js';

// GET /users - 모든 사용자 목록
const index = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.render("users/index", {
    title: "백엔드 API 테스트",
    users: users,
  });
});

// GET /users/new - 새 사용자 생성 폼
const newUser = asyncHandler(async (req, res) => {
  res.render("users/new");
});

// GET /users/:id - 특정 사용자 조회
const show = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await userService.getUserById(userId);
  
  if (!user) {
    return res.status(404).render("error", {
      title: "Error",
      status: 404,
      message: "사용자를 찾을 수 없습니다.",
    });
  }

  res.render("users/show", { user });
});

// GET /users/:id/edit - 사용자 수정 폼
const edit = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await userService.getUserById(userId);

  if (!user) {
    return res.status(404).render("error", {
      title: "Error",
      status: 404,
      message: "사용자를 찾을 수 없습니다.",
    });
  }

  res.render("users/edit", { user });
});

// POST /users - 새 사용자 생성
const create = asyncHandler(async (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!username || !password || !email || !phone) {
    return res.status(400).render("error", {
      title: "Error",
      status: 400,
      message: "모든 필드를 입력해주세요.",
    });
  }

  const newUserId = await userService.createUser(username, password, email, phone);
  console.log("새 사용자 추가:", { userid: newUserId, username, email, phone });
  res.redirect("/users");
});

// PUT /users/:id - 사용자 정보 업데이트
const update = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, phone } = req.body;

  const success = await userService.updateUser(userId, username, email, phone);
  
  if (success) {
    console.log(`사용자 ${userId} 수정 완료`);
    res.redirect("/users");
  } else {
    return res.status(404).render("error", {
      title: "Error",
      status: 404,
      message: "사용자를 찾을 수 없습니다.",
    });
  }
});

// DELETE /users/:id - 사용자 삭제
const destroy = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  const success = await userService.deleteUser(userId);
  
  if (success) {
    console.log(`사용자 ${userId} 삭제 완료`);
    res.redirect("/users");
  } else {
    return res.status(404).render("error", {
      title: "Error",
      status: 404,
      message: "삭제할 사용자를 찾을 수 없습니다.",
    });
  }
});

export { index, newUser, show, edit, create, update, destroy };