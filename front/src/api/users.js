import { camelToSnake, snakeToCamel } from '../utils/formatData';

import api from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
  //유저정보 불러오기(마이페이지 수정)
  getUserProfile: async (userNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.USERS.PROFILE(userNo));
      return snakeToCamel(data);
    } catch (error) {
      console.error('프로필 조회 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  getCareGiverProfile: async (userNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.USERS.CAREPROFILE(Number(userNo)));
      return snakeToCamel(data);
    } catch (error) {
      console.error('프로필 조회 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  //아이디 중복 검사
  checkUserId: async (userId) => {
    const res = await api.get(API_ENDPOINTS.USERS.CHECK_ID, {
      params: { userId },
    });
    return { available: res.data };
  },

  //회원가입
  signUp: async (userData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.USERS.BASE, camelToSnake(userData));
     
      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '회원가입에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  login: async (userId, userPwd) => {
    try {
      //백엔드 서버 용
      const { data } = await api.post(API_ENDPOINTS.USERS.LOGIN, { user_id: userId, user_pwd: userPwd });

      const loginData = snakeToCamel(data);

      // 토큰 저장
      if (loginData.token) {
        sessionStorage.setItem('token', loginData.token);
      }

      return loginData;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '로그인에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //  내 정보 조회 (JWT 토큰 사용)
  getMyInfo: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.MY);
      return snakeToCamel(response.data);
    } catch (error) {
      console.error('내 정보 조회 실패 : ', error);
      throw error;
    }
  },

  // user 정보 수정 (마이페이지 수정)
  updateUserProfile: async (userNo, updatedData) => {
    try {
      const { data } = await api.patch(API_ENDPOINTS.USERS.PROFILE_UPDATE(userNo), camelToSnake(updatedData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    } catch (error) {
      console.error('회원정보 수정 실패:', error.response?.data?.message || error.message);
      throw new Error('서버 통신 불량');
    }
  },

  //회원탈퇴 기능
  deleteUser: async (userNo) => {
    try {
      const { data } = await api.patch(API_ENDPOINTS.USERS.DELETE(userNo));
      return data;
    } catch (error) {
      console.error('회원탈퇴 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  //매인 페이지 간병사, 보호자 카운트
  getUserCounts: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.USERS.COUNT);
      return snakeToCamel(data);
    } catch (error) {
      console.error('유저 수 통계 가져오기 실패: ', error);
      throw error;
    }
  },

  // 비밀번호 찾기 - 비밀번호 재설정
  // 이메일이 아이디이기때문에 파라미터 userId로 받음
  resetPassword: async (userId, userPwd, code) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.RESET_PASSWORD, camelToSnake({ userId, userPwd, code }));
      return response;
    } catch (error) {
      console.error('비밀번호 변경 실패 :', error.response?.data?.message || error.message);
      throw error;
    }
  },

  changePassword: async ({ userNo, currentPassword, newPassword }) => {
    try {
      const payload = {
        user_no: userNo,
        current_password: currentPassword,
        new_password: newPassword,
      };

      const { data } = await api.patch(API_ENDPOINTS.USERS.CHANGE_PASS(userNo), payload);
      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '비밀번호 변경에 실패했습니다1.';
        throw new Error(message);
      }
    }
  },
};
