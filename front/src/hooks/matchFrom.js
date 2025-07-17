import { useState } from 'react';

import { matchingService } from '../api/matching';
import { searchForm } from './searchForm';

export const MatchForm = () => {
  //날짜상태
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // 진행중 매칭 관련 상태
  const [caregiverList, setCareGiverList] = useState([]);

  // 종료된 매칭 관련 페이징 상태
  const [endedCaregiverList, setEndedCaregiverList] = useState([]);
  const [endedCurrentPage, setEndedCurrentPage] = useState(1);
  const [endedTotalPage, setEndedTotalPage] = useState(1);
  const [selectedPatNo, setSelectedPatNo] = useState(null);

  // 현재 매칭정보 : 특정 환자의 간병인 목록 가져오기
  const getCareGiver = (patNo) => {
    setCareGiverList([]);
    
    const getList = async () => {
      try {
        const res = await matchingService.getMatchginCargiver(patNo, 'Y');
        
        setSelectedPatNo(patNo);
        res.length === 0 ? setCareGiverList([]) : setCareGiverList(res);

      } catch (err) {
        console.error(err);
      }
    };
    getList();
  };



  // 종료된 매칭정보
  const getEndedMatchingList = async (patNo, page = 1) => {
    try {
      setEndedCaregiverList([]);

      const res = await matchingService.getEndedMatchingCaregivers(patNo, page - 1, 5, 'N');

      EndMatchResultList(res);
      setSelectedPatNo(patNo);
    
      setStartDate(null);
      setEndDate(null);


    } catch (err) {
      console.error(err);
    }
  };

  // 종료된 매칭 페이지 변경 핸들러
  const handleEndedPageChange = (page) => {
    setEndedCurrentPage(page);

    if (selectedPatNo) {
      if (startDate && endDate) {
        handleSearchClick(page);
        return;
      }
      getEndedMatchingList(selectedPatNo, page);
    }
  };

  const EndMatchResultList = (res) => {
    setEndedCaregiverList(res.content || []);
    setEndedTotalPage(res.totalPage || res.totalPages || 1);
    setEndedCurrentPage((res.currentPage || res.number || 0) + 1);
  };

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

  // 날짜 검색기능함수
  const { getSearchDateList } = searchForm();

  // 날짜 검색후 페이지 정보 전달
  const handleSearchClick = async (page = 1) => {
    if (!selectedPatNo) {
      alert('돌봄대상자를 선택해주세요');
    }
    try {
      const res = await getSearchDateList(selectedPatNo, page, 5, startDate, endDate);

      EndMatchResultList(res);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    getCareGiver,
    getEndedMatchingList,
    handleEndedPageChange,
    getSearchDateList,
    handleSearchClick,
    setSelectedPatNo,
    handleStartDateChange,
    handleEndDateChange,
    startDate,
    endDate,
    selectedPatNo,
    caregiverList,
    endedCaregiverList,
    endedCurrentPage,
    endedTotalPage,
  };
};
