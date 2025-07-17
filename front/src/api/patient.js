import api from './axios';
import { API_ENDPOINTS } from './config';
import { snakeToCamel, camelToSnake } from '../utils/formatData';

export const patientService = {
  //환자목록조회
  getPatients: async (guardianNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.PATIENT.DETAIL(guardianNo));

      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '환자목록을 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //환자등록
  postNewPatient: async (data) => {
    try {
      await api.post(API_ENDPOINTS.PATIENT.BASE, camelToSnake(data));
    } catch (error) {
      console.log(error);
      throw new Error('서버 통신 불량');
    }
  },

  //환자번호로 정보 가져오기
  getPatientId: async (patNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.PATIENT.PATDETAIL(patNo));

      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '환자목록을 불러오는데 실패했습니다.';
        throw new Error(message);
      }
      throw new Error('서버 통신 불량');
    }
  },

  updatePatient: async (patNo, data) => {
    
    try {
  
      await api.patch(API_ENDPOINTS.PATIENT.PATCH(Number(patNo)), camelToSnake(data));
    } catch (error) {
      console.error('돌봄대상자 수정 실패:', error);
      throw new Error('돌봄대상자 수정하는데 실패했습니다.');
    }
  },
};
