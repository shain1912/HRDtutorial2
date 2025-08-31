import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByUsername } from '../models/userModel.js';

const userService = {
  // 모든 사용자 조회
  async getAllUsers() {
    try {
      return await getAllUsers();
    } catch (error) {
      console.error("사용자 목록 조회 오류:", error);
      throw error;
    }
  },

  // ID로 사용자 조회
  async getUserById(userid) {
    try {
      return await getUserById(userid);
    } catch (error) {
      console.error("사용자 조회 오류:", error);
      throw error;
    }
  },

  // 새 사용자 생성
  async createUser(username, password, email, phone) {
    try {
      return await createUser(username, password, email, phone);
    } catch (error) {
      console.error("사용자 생성 오류:", error);
      throw error;
    }
  },

  // 사용자 정보 업데이트
  async updateUser(userid, username, email, phone) {
    try {
      return await updateUser(userid, username, email, phone);
    } catch (error) {
      console.error("사용자 업데이트 오류:", error);
      throw error;
    }
  },

  // 사용자 삭제
  async deleteUser(userid) {
    try {
      return await deleteUser(userid);
    } catch (error) {
      console.error("사용자 삭제 오류:", error);
      throw error;
    }
  },

  // 사용자명으로 조회
  async getUserByUsername(username) {
    try {
      return await getUserByUsername(username);
    } catch (error) {
      console.error("사용자 조회 오류:", error);
      throw error;
    }
  }
};

export default userService;