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
      // 상세 보기에 들어가는 모든 정보(환자 정보, 보호자 전화번호, 보유질병, 제목,시급 등...) 불러와야함 실제 서버에서
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
