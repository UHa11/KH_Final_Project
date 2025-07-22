import React, { useState } from 'react';
import styled from 'styled-components';

import { media } from '../styles/MediaQueries';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/DatePiker.css'

const SearchDate = ({handleSearchClick, startDate, endDate, handleStartDateChange, handleEndDateChange, isOpen }) => {



   const CustomDateButton = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-datepicker-button" onClick={onClick} ref={ref}>
      <span>{value || '날짜 선택'}</span>
    </button>
  ));

  return (
    <SearchDivWrap>
    <SearchDateWrap>
      <DatePicker
        dateFormat={'yyyy/MM/dd'}
        selected={startDate}
        onChange={handleStartDateChange}
        customInput={<CustomDateButton />}
        popperPlacement="bottom"
        popperModifiers={{
          //@ts-ignore
          flip: {
            behavior: ["bottom"],
          },
          preventOverflow: {
            enabled: false,
          },
          hide: {
            enabled: false,
         },
       }}
      ></DatePicker>
      <p> ~ </p>
      <DatePicker
        dateFormat={'yyyy/MM/dd'}
        selected={endDate}
        onChange={handleEndDateChange}
        customInput={<CustomDateButton />}
      ></DatePicker>

      <SearchBtn onClick={handleSearchClick}>검색</SearchBtn>
    </SearchDateWrap>
  </SearchDivWrap>
  );
};

export default SearchDate;

const SearchDivWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  width: inherit;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const SearchDateWrap = styled.div`
  display: flex; 
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

   ${media.sm`    

    gap: ${({ theme }) => theme.spacing[5]};
 `}
`;

const SearchBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  width: 100px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease; /* 호버 효과 */

  &:hover {
    background-color: #e07243; /* 호버 시 약간 어두운 오렌지 */
  }
  ${media.sm`
    width: 150px;
  `}

`;