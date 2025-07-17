// 예시입니다. 저희 프로젝트에 맞게 변경해야 합니다.

const { VITE_JSON_SERVER_URL, VITE_SPRING_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_CONFIG = {
  BASE_URL: `${VITE_SPRING_URL}`, // Spring 들어가면 여기 변수만 VITE_SPRING_URL로 변경해야함
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const API_ENDPOINTS = {
  // PRODUCTS: {
  //   BASE: '/products',
  // },

  COMMUNITY: {
    BASE: '/community/v1',
    UPDATE: '/community/v1/update',
    UPDATE_REPLY: '/community/v1/update_reply',
    CAREGIVER: (option, keyword, page, size) =>
      `/community/v1/caregiver?option=${option}&keyword=${keyword}&page=${page}&size=${size}`,
    GUARDIAN: (option, keyword, page, size) =>
      `/community/v1/guardian?option=${option}&keyword=${keyword}&page=${page}&size=${size}`,
    DETAIL: (boardNo) => `/community/v1/detail?board_no=${boardNo}`, // 특정 게시글
    REPLY: `/community/v1/reply`,
    REPLY_QUESTION: `/community/v1/reply/question`,
    QUESTION: (option, keyword, page, size) =>
      `/community/v1/question?option=${option}&keyword=${keyword}&page=${page}&size=${size}`,
    QUESTION_HISTORY: (option, keyword, userNo, page, size) =>
      `/community/v1/question?option=${option}&keyword=${keyword}&user_no=${userNo}&page=${page}&size=${size}`,
    CREATE_QUESTION: '/community/v1/question/create',
    DELETE: (boardNo) => `/community/v1/delete?boardNo=${boardNo}`,
    DELETE_REPLY: (replyNo) => `/community/v1/reply_delete?replyNo=${replyNo}`,
  },

  USERS: {
    BASE: '/users/v1',
    CHECK_ID: '/users/v1/check', //아이디 중복 검사
    PROFILE: (userNo) => `/users/v1?user_no=${userNo}`,
    LOGIN: '/users/v1/login',
    MY: '/users/v1/me',
    DETAIL: (userId) => `/users/v1?user_id=${userId}`,
    PROFILE_UPDATE: (userNo) => `/users/v1/${userNo}`,
    CAREPROFILE: (userNo) => `/users/v1?user_no=${userNo}`,
    DELETE: (userNo) => `/users/v1/${userNo}/delete`,
    COUNT: '/users/v1/user-counts',
    RESET_PASSWORD: '/users/v1/reset_password',
    CHANGE_PASS: (userNo) => `/users/v1/${userNo}/change-password`,
  },
  REVIEWS: {
    BASE: '/review/v1',
    SIMPLE_LIST: '/review/v1/simple-list',
    LIST: (currentPage, userNo) => `/review/v1/list?page=${currentPage - 1}&userNo=${userNo}`,
    DETAIL: (currentPage, resumeNo) => `/review/v1/detail?page=${currentPage - 1}&resumeNo=${resumeNo}`,
    DELETE: (reviewNo) => `/review/v1/delete?reviewNo=${reviewNo}`,
  },

  HIRING: {
    BASE: '/hiring/v1',
    SIMPLE_LIST: '/hiring/v1/simple-list',
    LIST: '/hiring/v1/list',
    MYLIST: (currentPage, userNo) => `/hiring/v1/my-list?page=${currentPage - 1}&userNo=${userNo}`,
    DETAIL: (hiringNo) => `/hiring/v1/${hiringNo}`, //get
    STATUS: (hiringNo) => `/hiring/v1/${hiringNo}/status`,
    DELETE: (hiringNo) => `/hiring/v1/${hiringNo}`, //patch
  },

  RESUME: {
    BASE: '/resume/v1',
    SIMPLE_LIST: '/resume/v1/simple-list',
    LIST: '/resume/v1/list',
    DETAIL: (resumeNo) => `/resume/v1/detail/${resumeNo}`,
    MYRESUME: (currentPage, userNo) => `/resume/v1/user?page=${currentPage - 1}&userNo=${userNo}`,
    UPDATE: (resumeNo) => `/resume/v1/${resumeNo}`,
    MYRESUMMODAL: (userNo) => `/resume/v1/user/all?userNo=${userNo}`,
  },

  PATIENT: {
    BASE: '/patient/v1',
    DETAIL: (guardianNo) => `/patient/v1?guardian_no=${guardianNo}`,
    PATDETAIL: (patNo) => `/patient/v1/${patNo}`,
    PATCH: (patNo) => `/patient/v1/${patNo}`,
  },

  DISEASE: {
    BASE: '/disease/v1',
    DETAIL: (disNo) => `/patients/v1?disNo=${disNo}`,
  },

  REPORT: {
    BASE: `/report/v1`,
    LIST: (patNo) => `/report/v1/${patNo}`,
    SEARCH: (reportNo) => `/report/v1/detail/${reportNo}`,
  },

  PROPOSER: {
    BASE: '/proposer/v1',
    LIST: (hiringNo) => `/proposer/v1?hiring_no=${hiringNo}`,
    MYLIST: (currentPage, userNo) => `/proposer/v1/my-list?page=${currentPage - 1}&userNo=${userNo}`,
    STATUS: (hiringNo, caregiverNo) => `/proposer/v1/check?hiring_no=${hiringNo}&caregiver_no=${caregiverNo}`,
    CANCEL: (hiringNo, caregiverNo) => `/proposer/v1/cancel?hiring_no=${hiringNo}&caregiver_no=${caregiverNo}`,
    ACCEPT: '/proposer/v1/accept',
    CHECK_ACCEPTED: (hiringNo, resumeNo) => `/proposer/v1/accept/check?hiring_no=${hiringNo}&resume_no=${resumeNo}`,
    DELETE_HISTORY: (proposerNo) => `/proposer/v1/${proposerNo}`,
    GET_HIRING_OWNER: (hiringNo) => `/proposer/v1/hiring/${hiringNo}/owner`,
  },

  MATCHING: {
    BASE: '/matching/v1',
    LIST: (patNo, status) => `/matching/v1?pat_no=${patNo}&status=${status}`,
    PATCH: (matNo, status) => `/matching/v1?mat_no=${matNo}&status=${status}`,
    ENDLIST: (patNo, status) => `/matching/v1/matched?pat_no=${patNo}&status=${status}`,
    PATLIST: (caregiverNo, status) => `/matching/v1/caregiver?caregiver_no=${caregiverNo}&status=${status}`,
    PAT_ENDLIST: (caregiverNo, status) => `/matching/v1/caregiver/matched?caregiver_no=${caregiverNo}&status=${status}`,
    SEARCHLIST: () => `/matching/v1/matched/check`,
    SEARCHDATELIST: () => `/matching/v1/matched/date`,
  },

  NOTIFICATIONS: {
    LIST: (userNo) => `/notifications/v1/list?user_no=${userNo}`,
    IS_READ: (userNo) => `/notifications/v1/unread-count?user_no=${userNo}`,
    READ: (userNo) => `/notifications/v1/mark-read?user_no=${userNo}`,
    DELETE_ALL: (userNo) => `/notifications/v1/delete-all?user_no=${userNo}`,
    DELETE: (notificationNo) => `/notifications/v1/${notificationNo}`,
  },

  API: {
    BASE: '/api/address',
    REGION: (cd) => {
      return cd != null ? `/api/address/region?cd=${cd}` : `/api/address/region`;
    },
  },

  EMAIL: {
    BASE: '/auth/email',
    SEND_RESET_LINK: '/auth/email/send-reset-link',
    SEND_CODE: '/auth/email/send-code',
    VERIFY_EMAIL_CODE: '/auth/email/verify',
  },

  AI: {
    BASE: '/ai',
    RESPONSE: (patNo) => `/ai?pat_no=${patNo}`,
  },
};
