
import { useState } from 'react';
import { matchingService } from '../api/matching';

export const searchForm = () => {

  // test
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dateReset = () => {
    setStartDate(null);
    setEndDate(null);

  }

  const handleStartDateChange = (date) => {
    if (!date) return;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // 오전 00:00:00
    setStartDate(startOfDay);
  };

  const handleEndDateChange = (date) => {
    if (!date) return;
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59); // 오후 11:59:59
    setEndDate(endOfDay);
  };

  
  // 날짜 검색 함수
  const getSearchDateList =  async (patNo, page = 1 , size = 5, startDate, endDate) => {
   

    try {
      const  data  = await matchingService.getSearchingList(patNo, startDate, endDate, page - 1, size);

      return data;
    }catch(error){
      console.log("실패입니다.", error);
    }
  };

 
  return {
    getSearchDateList,
    startDate, 
    endDate,
    dateReset,
    setStartDate,
    setEndDate,
    handleStartDateChange,
    handleEndDateChange
  };
};
