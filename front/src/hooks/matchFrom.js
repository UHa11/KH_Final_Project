import { useState } from 'react';

import { matchingService } from '../api/matching';
import { searchForm } from './searchForm';

export const MatchForm = () => {
  // 진행중 매칭 관련 상태
  const [caregiverList, setCareGiverList] = useState([]);

  //종료된 매칭 관련 페이징 상태
  const [endedCurrentPage, setEndedCurrentPage] = useState(1);
  const [endedTotalPage, setEndedTotalPage] = useState(1);

  const EndMatchResultList = (res) => {
    setCareGiverList(res.content || []);
    setEndedTotalPage(res.totalPage || res.totalPages || 1);
    setEndedCurrentPage((res.currentPage || res.number || 0) + 1);
  };

  const [selectedPatNo, setSelectedPatNo] = useState(null);

  // 날짜 검색기능함수
  const { getSearchDateList, startDate, endDate } = searchForm();

  const changeSelectNo = (patNo) => {
    setSelectedPatNo(patNo);
  };

  const cargiverListRest = () => {
    setCareGiverList('');
  };

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
      setCareGiverList([]);

      const res = await matchingService.getEndedMatchingCaregivers(patNo, page - 1, 5, 'N');

      EndMatchResultList(res);
      setSelectedPatNo(patNo);
    } catch (err) {
      console.error(err);
    }
  };

  // 날짜 검색후 데이터 가져오기(페이징정보 포함)
  const handleSearchClick = async (startDate, endDate, page = 1) => {
    console.log(startDate, endDate);
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

  // 종료된 매칭 페이지 변경 핸들러
  const handleEndedPageChange = (page) => {
    setEndedCurrentPage(page);

    if (selectedPatNo) {
      if (startDate && endDate) {
        console.log(startDate, endDate);
        handleSearchClick(page);
        return;
      }
      getEndedMatchingList(selectedPatNo, page);
    }
  };

  return {
    getCareGiver,
    getEndedMatchingList,
    getSearchDateList,
    cargiverListRest,
    handleSearchClick,
    selectedPatNo,
    changeSelectNo,
    caregiverList,
    handleEndedPageChange,
    endedCurrentPage,
    endedTotalPage,
  };
};
