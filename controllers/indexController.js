import asyncHandler from 'express-async-handler';

// GET / - 홈페이지 (users로 리디렉션)
const home = asyncHandler(async (req, res) => {
  res.redirect("/users");
});

// GET /redirect - 리디렉션 테스트
const redirect = asyncHandler(async (req, res) => {
  console.log("리디렉션 시작...");
  res.redirect("/target");
});

// GET /target - 리디렉션 도착 페이지
const target = asyncHandler(async (req, res) => {
  res.render("target", { message: "성공적으로 리디렉션되었습니다!" });
});

export { home, redirect, target };