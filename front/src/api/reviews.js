import { useStore } from 'zustand';
import api from './axios';
import { API_ENDPOINTS } from './config';
import { camelToSnake, snakeToCamel } from '../utils/formatData';

export const reviewService = {
  //리뷰전체조회
  getReviews: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.REVIEWS.SIMPLE_LIST);
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰를 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  // 내가 쓴 리뷰 조회
  getMyWrittenReviews: async (currentPage, userNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.REVIEWS.LIST(currentPage, userNo));
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰를 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  // 내가 받은 리뷰 조회
  getReceivedReviews: async (currentPage, userNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.REVIEWS.LIST(currentPage, userNo));
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰를 불러오는데 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //리뷰작성
  saveReview: async ({ matNo, userNo, rating, inputValue }) => {
    try {
      const reviewData = {
        matNo,
        reviewWriterNo: userNo,
        reviewContent: inputValue,
        score: Number(rating),
      };
      
      const snakeCaseData = camelToSnake(reviewData);
  
      const { data } = await api.post(API_ENDPOINTS.REVIEWS.BASE, snakeCaseData);

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰 불러오기에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //특정 이력서안에 간병인에 대한 리뷰
  getResumeDetailReviews: async (currentPage, resumeNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.REVIEWS.DETAIL(currentPage, resumeNo));
    
      return snakeToCamel(data);
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '리뷰를 불러오는데 실패했습니다.';
        throw new Error(message);
      }
    }
    throw new Error('서버 통신 불량');
  },
};
