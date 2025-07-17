import React, { useState } from 'react';
import styled from 'styled-components';
import { IoSearchOutline } from 'react-icons/io5';

const SearchBar = ({ onSearch }) => {
  // onSearch prop을 받도록 수정
  const [keyword, setKeyword] = useState('');

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      // onSearch prop이 있으면 호출
      onSearch(keyword);
    }
    // 여기에 실제 검색 API 호출 또는 검색 로직을 구현합니다.
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchInputContainer>
      <KeywordInput
        type="text"
        name="keyword"
        placeholder="키워드를 검색해주세요"
        value={keyword}
        onChange={handleKeywordChange}
        onKeyPress={handleKeyPress}
      />
      <SearchButton onClick={handleSearch}>
        <SearchIcon>
          <IoSearchOutline />
        </SearchIcon>
      </SearchButton>
    </SearchInputContainer>
  );
};

export default SearchBar;

// ----------------------------------------------------
// Styled Components
// ----------------------------------------------------

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  /* max-width: 400px; */
  border: 1px solid #ccc; /* 테두리 색상 */
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
  background-color: white; /* 배경색 */
`;

const KeywordInput = styled.input`
  flex-grow: 1; /* 남은 공간을 모두 차지 */
  padding: ${({ theme }) => theme.spacing[2]};
  border: none; /* input 자체의 테두리 제거 */
  outline: none; /* 포커스 시 아웃라인 제거 */
  font-size: 16px; /* 폰트 크기 */
  color: #333; /* 텍스트 색상 */

  &::placeholder {
    color: #999; /* 플레이스홀더 텍스트 색상 */
  }
`;

const SearchButton = styled.button`
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
`;

const SearchIcon = styled.span`
  font-size: 18px; /* 아이콘 크기 */
`;
