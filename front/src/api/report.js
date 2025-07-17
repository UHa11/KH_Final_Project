import { camelToSnake, snakeToCamel } from '../utils/formatData';
import api from './axios';
import { API_ENDPOINTS } from './config';

export const reportService = {
  getReports: async (patNo) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.REPORT.LIST(patNo));
      return snakeToCamel(data) || [];
    } catch (error) {
      console.log('일지를 가져오지 못함 : ', error.response?.data?.message || '일지 불러오기 실패');
      return [];
      // throw error;
    }
  },
  addReports: async (report) => {
    try {
      const reportInfo = {
        ...report,
        //db에서 reportNo 하나 넣어야함
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        status: 'Y',
      };

      const createReportContent = (report) => {
        // 필터링: subTitle 및 content와 관련된 키들만 추출
        const subTitles = Object.entries(report).filter(([key]) => key.startsWith('subTitle'));
        const contents = Object.entries(report).filter(([key]) => key.startsWith('content'));

        // 정렬 및 조합
        const reportContent = subTitles
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, subTitleValue], i) => `${subTitleValue}\n${contents[i]?.[1] || ''}`)
          .join('\n\n');

        return { ...report, reportContent };
      };

      // 변환
      const updatedReport = createReportContent(reportInfo);

      const { data } = await api.post(API_ENDPOINTS.REPORT.BASE, camelToSnake(updatedReport));
      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '일지작성에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  modifyReports: async (report) => {
    try {
      const reportInfo = {
        ...report,
        updateDate: new Date().toISOString(),
      };

      const { data } = await api.patch(API_ENDPOINTS.REPORT.BASE, camelToSnake(reportInfo));

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '일지수정에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  removeReports: async (reportNo) => {
    try {
      await api.patch(API_ENDPOINTS.REPORT.SEARCH(reportNo));
      return 1;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '일지삭제에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
