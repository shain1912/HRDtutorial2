import bcrypt from 'bcrypt';
import { getUserByUsername, createUser } from '../models/userModel.js';

const authService = {
  // 사용자 인증
  async authenticateUser(username, password) {
    try {
      const user = await getUserByUsername(username);
      
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error("로그인 처리 오류:", error);
      throw error;
    }
  },

  // 사용자 등록
  async registerUser({ username, password, confirmPassword, email, phone }) {
    try {
      // 입력값 검증
      if (!username || !password || !confirmPassword || !email || !phone) {
        return { success: false, errorCode: 1 }; // 모든 필드 입력 필요
      }

      if (password !== confirmPassword) {
        return { success: false, errorCode: 2 }; // 비밀번호 불일치
      }

      if (password.length < 6) {
        return { success: false, errorCode: 3 }; // 비밀번호 너무 짧음
      }

      // 중복 사용자명 확인
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return { success: false, errorCode: 4 }; // 이미 존재하는 사용자명
      }

      // 새 사용자 생성
      const newUserId = await createUser(username, password, email, phone);
      
      return { success: true, userid: newUserId };
    } catch (error) {
      console.error("회원가입 처리 오류:", error);
      return { success: false, errorCode: 5 }; // 서버 오류
    }
  }
};

export default authService;