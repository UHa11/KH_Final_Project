import api from './axios';
import { API_ENDPOINTS } from './config';
import { snakeToCamel } from '../utils/formatData';

export const commuService = {
  getCaregiver: async (option, keyword, page, size) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.CAREGIVER(option, keyword, page, size));
      return snakeToCamel(data);
    } catch (error) {
      console.log('게시판정보를 가져오지 못함 : ', error.response?.data?.message || '게시판목록 불러오기 실패');
      throw new Error('서버 통신 불량');
    }
  },
  getQuestion: async (option, keyword, page, size) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.QUESTION(option, keyword, page, size));
      return snakeToCamel(data);
    } catch (error) {
      console.log('게시판정보를 가져오지 못함 : ', error.response?.data?.message || '게시판목록 불러오기 실패');
      throw new Error('서버 통신 불량');
    }
  },
  getQuestionHistory: async (option, keyword, userNo, page, size) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.QUESTION_HISTORY(option, keyword, userNo, page, size));
      return snakeToCamel(data);
    } catch (error) {
      console.log(`질문 상세(${userNo})를 가져오지 못함: `, error.response?.data?.message || '실패');
      throw new Error('서버 통신 불량');
    }
  },
  getGuardian: async (option, keyword, page, size) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.GUARDIAN(option, keyword, page, size));
      return snakeToCamel(data);
    } catch (error) {
      console.log('게시판정보를 가져오지 못함 : ', error.response?.data?.message || '게시판목록 불러오기 실패');
      throw new Error('서버 통신 불량');
    }
  },
  createCommunity: async (boardData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.COMMUNITY.BASE, boardData);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || '게시글 작성에 실패했습니다.';
        throw new Error(errorMessage);
      }
      throw new Error('서버와의 통신에 실패했습니다.');
    }
  },
  createReply: async (replyData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.COMMUNITY.REPLY, replyData);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || '댓글 작성에 실패했습니다.';
        throw new Error(errorMessage);
      }
      throw new Error('서버와의 통신에 실패했습니다.');
    }
  },
  createQuestion: async (questionData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.COMMUNITY.CREATE_QUESTION, questionData);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || '문의글 작성에 실패했습니다.';
        throw new Error(errorMessage);
      }
      throw new Error('서버와의 통신에 실패했습니다.');
    }
  },
  createReplyQusetion: async (questionData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.COMMUNITY.REPLY_QUESTION, questionData);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || '문의글 작성에 실패했습니다.';
        throw new Error(errorMessage);
      }
      throw new Error('서버와의 통신에 실패했습니다.');
    }
  },
  getCommunityDetail: async (boardNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.DETAIL(boardNo), {
        withCredentials: true,
      });

      return snakeToCamel(data);
    } catch (error) {
      console.error('게시글 조회 실패:', error.response?.data?.message || error.message);
      throw new Error('서버 통신 불량');
    }
  },
  updateCommunity: async (boardData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.COMMUNITY.UPDATE, boardData);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || '게시글 작성에 실패했습니다.';
        throw new Error(errorMessage);
      }
      throw new Error('서버와의 통신에 실패했습니다.');
    }
  },
  updateReply: async (replyData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.COMMUNITY.UPDATE_REPLY, replyData);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || '게시글 작성에 실패했습니다.';
        throw new Error(errorMessage);
      }
      throw new Error('서버와의 통신에 실패했습니다.');
    }
  },
  deleteBoard: async (boardNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.DELETE(boardNo));
      return snakeToCamel(data);
    } catch (error) {
      console.error('게시글 조회 실패:', error.response?.data?.message || error.message);
      throw new Error('서버 통신 불량');
    }
  },

  deleteReply: async (replyNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.COMMUNITY.DELETE_REPLY(replyNo));
      return snakeToCamel(data);
    } catch (error) {
      console.error('게시글 조회 실패:', error.response?.data?.message || error.message);
      throw new Error('서버 통신 불량');
    }
  },
};
