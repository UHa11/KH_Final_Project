import api from './axios';
import { API_ENDPOINTS } from './config';
import { snakeToCamel } from '../utils/formatData';

export const aiService = {
  getAiResponse: async (patNo) => {
    try {
      const { data } = await api.post(
        API_ENDPOINTS.AI.RESPONSE(Number(patNo)),
        null, // POST body 없음
        {
          timeout: 15000, // 이 요청만 15초 대기 허용
        }
      );

      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '환자목록을 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
