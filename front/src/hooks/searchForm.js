
import { matchingService } from '../api/matching';

export const searchForm = () => {



  // 날짜 검색 함수
  const getSearchDateList =  async (patNo, page = 1 , size = 5, startDate, endDate) => {
   

    try {
      const  data  = await matchingService.getSearchingList(patNo, startDate, endDate, page - 1, size);
    
      return data;
    }catch(error){
      console.log("실패입니다.", error);
    }
  }

  

 
  return {
    getSearchDateList,
  };
};
