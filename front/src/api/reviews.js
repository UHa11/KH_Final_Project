import { useStore } from 'zustand';
import api from './axios';
import { API_ENDPOINTS } from './config';
import { snakeToCamel } from '../utils/formatData';

export const reviewService = {
  //리뷰전체조회
  getReviews: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.REVIEWS.BASE);

      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰를 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  //특정 간병인 리뷰조회

  //리뷰작성
  saveReview: async (rating, inputValue) => {
    try {
      const { user } = useStore.useUserStore();
      const { data } = await api.post(API_ENDPOINTS.REVIEWS.BASE, {
        reviewWriterNo: user,
        reviewContent: inputValue,
        score: rating,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        status: 'Y',
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰 불러오기에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  getReviewsByUser: async (userNo) => {
    const response = await api.get(API_ENDPOINTS.REVIEWS.DETAIL(userNo));

    return snakeToCamel(response).data;
  },
};
