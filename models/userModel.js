import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

// MySQL 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// 연결 풀 생성
const pool = mysql.createPool(dbConfig);

// 모든 사용자 조회
const getAllUsers = asyncHandler(async () => {
  const [rows] = await pool.execute(
    "SELECT userid, username, email, phone FROM users"
  );
  return rows;
});

// 사용자명으로 사용자 조회 (로그인용)
const getUserByUsername = asyncHandler(async (username) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0] || null;
});

// ID로 사용자 조회
const getUserById = asyncHandler(async (userid) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE userid = ?",
    [userid]
  );
  return rows[0] || null;
});

// 새 사용자 추가
const createUser = asyncHandler(async (username, password, email, phone) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    "INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)",
    [username, hashedPassword, email, phone]
  );
  return result.insertId;
});

// 사용자 업데이트
const updateUser = asyncHandler(async (userid, username, email, phone) => {
  const [result] = await pool.execute(
    "UPDATE users SET username = ?, email = ?, phone = ? WHERE userid = ?",
    [username, email, phone, userid]
  );
  return result.affectedRows > 0;
});

// 사용자 삭제
const deleteUser = asyncHandler(async (userid) => {
  const [result] = await pool.execute(
    "DELETE FROM users WHERE userid = ?",
    [userid]
  );
  return result.affectedRows > 0;
});

export { getAllUsers, getUserByUsername, getUserById, createUser, updateUser, deleteUser, pool };