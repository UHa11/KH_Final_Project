// 구직 API
import { camelToSnake, snakeToCamel } from '../utils/formatData';
import api from './axios';
import { API_ENDPOINTS } from './config';

export const jobSeekingService = {
  // 이력서(구직) 목록 가져오기
  getResumeList: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.RESUME.BASE);
      console.log(data);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '이력서 리스트를 가져오는데에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //이력서등록
  postNewResume: async (resumeData) => {
    try {
      await api.post(API_ENDPOINTS.RESUME.BASE, camelToSnake(resumeData));
    } catch (error) {
      console.log(error);
      throw new Error('서버 통신 불량');
    }
  },

  getMyResumeList: async (userNo) => {
    try {
      const { data } = await api.get(`${API_ENDPOINTS.RESUME.MYRESUME(userNo)}`); // 또는 경로 param이면 `/resumes/${userNo}`
      return snakeToCamel(data);
    } catch (error) {
      const message = error.response?.data?.message || '이력서 리스트를 가져오는데에 실패했습니다.';
      throw new Error(message);
    }
  },

  // 특정 이력서 가져오기
  getResume: async (resumeNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.RESUME.DETAIL(resumeNo));
      return snakeToCamel(data);
    } catch (error) {
      console.log(error);
      throw new Error('서버 통신 불량');
    }
  },

  updateResume: async (resumeNo, resumeData) => {
    try {
      await api.patch(API_ENDPOINTS.RESUME.UPDATE(resumeNo), camelToSnake(resumeData));
    } catch (error) {
      console.error(error);
      throw new Error('서버 통신 불량');
    }
  },

  deleteResume: async (resumeNo) => {
    try {
      // status 필드만 'N'으로 변경해서 PATCH 요청
      //서버 로 넘어갈시 변경해야할거임
      await api.patch(API_ENDPOINTS.RESUME.UPDATE(resumeNo), { status: 'N' });
    } catch (error) {
      console.error(error);
      throw new Error('서버 통신 불량');
    }
  },
};
