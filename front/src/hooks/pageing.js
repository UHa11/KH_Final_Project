import { useState } from 'react';

export const usePageing = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // set을 pros로 넘기는 함수
  const chagneCurrentPage = (value) => {
    setCurrentPage(value);
  };

  // 종료된 매칭 필요한 함수


  return {
    chagneCurrentPage,
    currentPage,
  };
};
