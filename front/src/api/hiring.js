// 구인 API
import { snakeToCamel } from '../utils/formatData';
import api from './axios';
import { API_ENDPOINTS } from './config';

export const hiringService = {
  // 구인 목록 가져오기
  getJobOpeningList: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.HIRING.BASE);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '구인 리스트를 가져오는데에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //세부 구인목록가져오기
  getHirngById: async (hiringNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.HIRING.DETAIL(hiringNo));

      return snakeToCamel(data[0]);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '구인 리스트를 가져오는데에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
