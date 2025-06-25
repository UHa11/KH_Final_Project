import { camelToSnake } from '../utils/formatData';
import api from './axios';
import { API_ENDPOINTS } from './config';

export const resumeService = {
  // 서비스 로직 변경할 예정 : jobSeeking에서 만들어주세요
  //이력서등록
  postNewResume: async (resumeData) => {
    try {
      await api.post(API_ENDPOINTS.RESUME.BASE, camelToSnake(resumeData));
    } catch (error) {
      console.log(error);
      throw new Error('서버 통신 불량');
    }
  },
};
