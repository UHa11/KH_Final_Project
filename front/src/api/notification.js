import { snakeToCamel } from '../utils/formatData';
import api from './axios';
import { API_ENDPOINTS } from './config';

export const notificationService = {
  // 유저 알림 리스트 조회
  getNotifications: async (userNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST(userNo));
      return snakeToCamel(data);
    } catch (error) {
      console.error('알림 조회 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  //안읽은 알림수 조회
  getUnreadCount: async (userNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.NOTIFICATIONS.IS_READ(userNo));
      return data; // int
    } catch (error) {
      console.error('알림 수 조회 실패:', error);
      return 0;
    }
  },

  //알림 창 열었을시 읽음 처리
  markAllAsRead: async (userNo) => {
    try {
      const { data } = await api.patch(API_ENDPOINTS.NOTIFICATIONS.READ(userNo));
      return data;
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // 사용자 알림 전체 삭제
  deleteAllNotifications: async (userNo) => {
    try {
      const { data } = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL(userNo));
      return data;
    } catch (error) {
      console.error('알림 전체 삭제 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  //알림 개별 삭제
  deleteNotification: async (notificationNo) => {
    try {
      const { data } = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationNo));
      return data;
    } catch (error) {
      console.error('알림 삭제 실패:', error.response?.data?.message || error.message);
      throw error;
    }
  },
};
