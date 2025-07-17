import api from './axios';
import { API_ENDPOINTS } from './config';
import { snakeToCamel, camelToSnake } from '../utils/formatData';

export const matchingService = {
  //매칭중 : 특정환자의 매칭목록 조회
  getMatchginCargiver: async (patNo, status) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MATCHING.LIST(patNo, status));
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '매칭목록을 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //매칭중 : 특정간병인의 매칭목록 조회
  getMatchingPatient: async (cargiverNo, status) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MATCHING.PATLIST(cargiverNo, status));

      console.log(data)

      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '매칭목록을 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //간병인 종료
  getMatchingChangeStatus: async (matNo, status) => {
    try {
      const res = await api.patch(API_ENDPOINTS.MATCHING.PATCH(matNo, status));
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '매칭목록을 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  // 종료된 매칭 조회하기 - 보호자 version
  getEndedMatchingCaregivers: async (patNo, page = 0, size = 5, status = 'N') => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MATCHING.ENDLIST(patNo, status), {
        params: {
          page,
          size,
        },
      });
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '종료된 매칭을 불러오는데 실패했습니다.';
        throw new Error(message);
      }
      throw new Error('서버 통신 불량');
    }
  },

  //  간병인 기준 종료된 매칭 환자 페이징 조회
  findMatchedPatients: async (caregiverNo, status, page = 0, size = 4) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MATCHING.PAT_ENDLIST(caregiverNo, status), {
        params: {
          page,
          size,
        },
      });
      return snakeToCamel(data);
    } catch (error) {
      const message = error.response?.data?.message || '종료된 매칭 환자를 불러오는데 실패했습니다.';
      throw new Error(message);
    }
  },

  getEndedMatchingCheckList: async (patNo, page = 0, size = 5, status = 'N', user_status = 'Y') => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MATCHING.SEARCHLIST(), {
        params: {
          pat_no: patNo,
          status: status,
          user_status: user_status,
          page,
          size,
        },
      });
      ongamepadconnected;
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '종료된 매칭을 불러오는데 실패했습니다.';
        throw new Error(message);
      }
      throw new Error('서버 통신 불량');
    }
  },

  //일자검색
  getSearchingList: async (patNo, startDate, endDate, page = 0, size = 5) => {
    const formatDateToLocalISOString = (date) => {
      const offset = date.getTimezoneOffset() * 60000; // 분 단위를 밀리초로 변환
      const localISOTime = new Date(date - offset).toISOString().slice(0, 19); // Z 제거
      return localISOTime; // 예: "2025-07-06T00:00:00"
    };
    try {
      const { data } = await api.get(API_ENDPOINTS.MATCHING.SEARCHDATELIST(), {
        params: {
          pat_no: patNo,
          start_date: formatDateToLocalISOString(startDate),
          end_date: formatDateToLocalISOString(endDate),
          // end_date: new Date(endDate).toISOString().slice(0, 19),
          page,
          size,
        },
      });

      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '종료된 매칭을 불러오는데 실패했습니다.';
        throw new Error(message);
      }
      throw new Error('서버 통신 불량');
    }
  },
};
